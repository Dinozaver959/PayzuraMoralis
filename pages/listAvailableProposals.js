import Link from 'next/link';
import React, { useState, useEffect }  from 'react';
import { IconContext } from "react-icons";

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,  { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {MdKeyboardArrowUp} from "react-icons/md";
import {MdKeyboardArrowDown} from "react-icons/md";

import { styled  } from '@mui/material/styles';
import styles from "../styles/CreateContent.module.scss";
import Moralis from 'moralis';
import { GetWallet_NonMoralis, AcceptProposal_Moralis } from '../JS/local_web3_Moralis';


const StyledTableRow = styled(TableRow)({
  //'&:nth-of-type(odd)': {
  //  backgroundColor: "#343a3f",
  //  color: "white", // useless
  //},
  // hide last border
  //'&:last-child td, &:last-child th': {
  //  border: 0,
  //},
});

const StyledTableCell = styled(TableCell)({
 
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#343a3f",
    color: "white",
  },
  
 /*
  backgroundColor: "#343a3f",
  color: "white",
*/
  
});

const StyledInnerTableCell = styled(TableCell)({
 
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#4F575D",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,

    backgroundColor: "#4F575D",
    color: "white",
  },
  
 /*
  backgroundColor: "#343a3f",
  color: "white",
*/
  
});


export default function ListAvailableProposals() {

  const [data, setData] = useState([]);

  // load options using API call
  async function getCollectionsDetails() {
    const data = await fetch(`./api/api-getAvailableProposals`)
    .then(res => res.json())
    .then(json => setData(json));

    console.log(data);

    return data;
  };
  
  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();
  }, []);

  return (
    <>
        <div className={styles.FormContainer}>
            <div className={styles.createTitle}>
            Proposals Available
            </div><br></br>

                {(data && data[0]) ? (
                <>
                    <Table_normal data={data} />
                </>
                ) : (
                <>
                    There are no available proposals. 

                    <div className={styles.submitButtonOuter}> 
                    <Link href="/creteProposal" passHref>
                        <input className={styles.submitButton} type="submit" value="Create Proposal Now" ></input>
                    </Link>
                    </div>
                </>
                )} 
        </div>        
    </>
  )
}

function wrapContractAddressWithScanner(contractAddress, chainId){
  if(contractAddress && chainId){
    return(GetScannerFromChainId(chainId) + contractAddress);
  } else {
    return "";
  }
}

function wrapReveal(revealed){
  return (revealed) ? "yes" : "no";
}

function wrapPaymentOption(option){
  if(option == "royalty") return "5% mint royalty";
  if(option == "paid") return option;
  return "1000 $BYTES";  // upfront
}

function wrapchainId(chainId){
  if(chainId){
    return GetChainNameFromChainId(chainId);
  } else {
    return "";
  }
}

function Table_normal(props) {
    const { data } = props;

    return (
        <> 
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                <TableHead>
                    <StyledTableRow>
                    <StyledTableCell />
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Price (ETH)</StyledTableCell>
                    <StyledTableCell>Time Allowed (hours)</StyledTableCell>
                    <StyledTableCell>Accept Proposal</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                    <Row_normal key={item.id} item={item.name} />
                    ))}
                </TableBody>
                </Table>
            </TableContainer>

            <p id="submitFeedback" hidden></p>
        </>
    )
}

function Row_normal(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
        <StyledTableRow sx={{ '& > *': { borderBottom: 'unset'} }}>

            <StyledTableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                <IconContext.Provider value={{ color: "white" }} >                {/*  specify the color for the arrow */}
                {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </IconContext.Provider>
            </IconButton>
            </StyledTableCell>
            <StyledTableCell component="th" scope="row">
            {item.ProposalTitle}
            </StyledTableCell>
            <StyledTableCell>{item.Price}</StyledTableCell>
            <StyledTableCell>{item.TimeAllowed}</StyledTableCell>


            <StyledTableCell>
            

                <input className={styles.interactButton} type="submit" value="Accept Proposal (buyer)" onClick={() => 
                    AcceptProposal_Moralis(item.index)
                    .then(async (transactionHash) => {

                        // show the feedback text 
                        document.getElementById('submitFeedback').style.display = 'inline';
                        document.getElementById('submitFeedback').innerText = 'Creating proposal...'

                        var formData = new FormData();
                        formData.append('BuyerAccount', (Moralis.User.current()).id);

                        const connectedAddress = await GetWallet_NonMoralis();
                        formData.append('BuyerWallet', connectedAddress);
                        formData.append('transactionHash', transactionHash);
                        formData.append('objectId', item.objectId);

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/api/api-acceptedProposal', false);
                        xhr.onload = function () {
                            // update the feedback text 
                            document.getElementById('submitFeedback').style.display = 'inline';
                            document.getElementById('submitFeedback').innerText = 'proposal accepted'

                            // prevent the Submit button to be clickable and functionable
                            // removeHover()
                            // document.getElementById('SubmitButton').disabled = true

                            // think about also removing the hover effect
                            // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                            console.log("proposal created")
                        };
                        xhr.send(formData);
                    }).
                    catch((error) => {
                        console.error(error);
                        console.log("accept proposal error code: " + error.code);
                        console.log("accept proposal error message: " + error.message);
                        if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
                        else {document.getElementById('submitFeedback').innerText = error.message;}    
                        document.getElementById('submitFeedback').style.visibility = "visible";
                        process.exitCode = 1;
                    })
                }></input>

            </StyledTableCell>

        </StyledTableRow>

        
        <StyledTableRow>
            <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>            
                <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="details">

                    <TableBody>

                    <TableRow>
                        <StyledInnerTableCell></StyledInnerTableCell>
                        <StyledInnerTableCell>Description</StyledInnerTableCell>
                        <StyledInnerTableCell>{item.ProposalDescription}</StyledInnerTableCell>
                    </TableRow>

                    <TableRow>
                        <StyledInnerTableCell></StyledInnerTableCell>
                        <StyledInnerTableCell>Seller Wallet</StyledInnerTableCell>
                        <StyledInnerTableCell>{item.SellerWallet}</StyledInnerTableCell>
                    </TableRow>

                    </TableBody>

                </Table>
                </Box>
            </Collapse>
            </StyledTableCell>
        </StyledTableRow>
    </React.Fragment>
  );
}

