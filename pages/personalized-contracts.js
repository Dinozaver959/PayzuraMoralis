import React, { useState, useEffect, Fragment } from "react";
import { IconContext } from "react-icons";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

import { styled } from "@mui/material/styles";
import {
  GetWallet_NonMoralis,
  AcceptOfferBuyer_Moralis,
  ApproveERC20_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import PlaceholderIc from "../components/icons/Placeholder";
import LoadingPlaceholder from "../components/ui/LoadingPlaceholder";

import Image from "next/image";
import ETHIcon from "../components/images/ETH.webp";
import USDCIcon from "../components/images/USDC.webp";
import PlusIc from "../components/icons/Plus";
import ModalUi from "../components/ui/ModalUi";

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

export default function PersonalizedContracts(props) {
    const [data, setData] = useState([]);
    const [placeholder, setPlaceholder] = useState(true);

    // load options using API call
    async function getCollectionsDetails() {
        const connectedAddress = await GetWallet_NonMoralis();
        const data = await fetch(
            `./api/api-getPersonalizedOffers` +
                "?UserWallet=" +
                connectedAddress
        )
            .then((res) => res.json())
            .then((json) => setData(json));

        console.log(data);

        setPlaceholder(false);

        return data;
    }

    // Calling the function on component mount
    useEffect(() => {
        getCollectionsDetails();

        setTimeout(() => {
            setPlaceholder(false);
        }, 1200);
    }, [props.currentAccount]);

    return (
        <Fragment>
            <Navigation
              darkMode={props.darkMode}
              changeDarkMode={props.changeDarkMode}
              dropdownOpen={props.dropdownOpen}
              setDropdownOpen={props.setDropdownOpen}
              OpenDropdownFn={props.OpenDropdownFn}
              hasMenuDrawer={props.hasMenuDrawer}
              setMenuDrawer={props.setMenuDrawer}
              mobileDrawerFn={props.mobileDrawerFn}
              currentAccount={props.currentAccount}
              setCurrentAccount={props.setCurrentAccount}
            />

            <div className="containerMain">
                <div className="pageHeader">
                    <h1>Personalized Contracts Listed</h1>
                </div>

                <div className="card mt-10">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <h2>Hey UserName, Here are some offers for you!</h2>
                            <p>
                                Loreim ipsum dummy text, this is loreim ipsum
                                dummy content.
                            </p>
                        </div>
                    </div>
                    <div className="cardBody">
                        {placeholder ? (
                            <div className="blockLoading">
                                <LoadingPlaceholder
                                    extraStyles={{ position: "absolute" }}
                                />
                            </div>
                        ) : data[0] && data ? (
                            <Table_normal data={data} />
                        ) : (
                            <div className="noData">
                                <i>
                                    <PlaceholderIc />
                                </i>
                                <h2>There are no contracts for you.</h2>
                                <div className="submitButtonOuter">
                                    <Button
                                        link="/create-contract"
                                        classes={
                                            "button secondary withIcon rounded"
                                        }
                                    >
                                        <i>
                                            <PlusIc />
                                        </i>
                                        <span>Create Contract</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

function wrapPersonalized(wallets) {
    if (!wallets) {
        return "Any";
    } else {
        return wallets.replaceAll(",", "\n");
    }
}

function wrapArbiters(wallets) {
    if (!wallets) {
        return "Payzura Platform";
    } else {
        return wallets.replaceAll(",", "\n");
    }
}

function wrapEpochToDate(epoch) {
    var d = new Date(epoch * 1000);
    return d.toString(); // d.toDateString();
}

function tickerToIcon(ticker) {
    if (ticker == "USDC") {
        return USDCIcon;
    } else if (ticker == "ETH") {
        return ETHIcon;
    }
}

async function hasTheConnectedWalletAlreadyApprovedERC20(listApprovedBy) {
    const connectedAddress = await GetWallet_NonMoralis();
    if (!connectedAddress) {
        return false;
    }

    console.log("connectedAddress: ", connectedAddress);
    console.log(listApprovedBy);

    return listApprovedBy.includes(connectedAddress);
}

function Table_normal(props) {
    const { data } = props;

    const [modelData, setModelData] = useState({
        show: false,
        type: "alert",
        status: "Error",
        message: "",
    });

    function closeModelDataHandler() {
        setModelData({
            show: false,
        });
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell />
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Price (ETH)</StyledTableCell>
                            <StyledTableCell>
                                Time to Deliver
                            </StyledTableCell>
                            <StyledTableCell>Valid Until</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <Row_normal
                                key={item.id}
                                item={item.name}
                                setModelData={setModelData}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ModalUi content={modelData} closeModelFn={closeModelDataHandler} />
        </>
    );
}

function Row_normal(props) {
    const { item, setModelData } = props;
    const [open, setOpen] = React.useState(false);
    const [approvedERC20, setApprovedERC20] = useState(false); // need to force update on   A) wallet change

    useEffect(() => {
        const fetchData = async () => {
            const approved = await hasTheConnectedWalletAlreadyApprovedERC20(
                item.ApprovedBy
            );
            setApprovedERC20(approved);
        };

        fetchData()
            // make sure to catch any rerro
            .catch(console.error);

        // doesn't work - just leaving it here for reference
        // basically idea is, when user changes wallet/account -> update the button visibility based on new user
        /* 
      Moralis.onAccountChanged(async (accounts) => {
        const currentUser = Moralis.User.current();
        console.log();
        if(currentUser){
          const approved = await hasTheConnectedWalletAlreadyApprovedERC20(item.ApprovedBy);
          // console.log("hasTheConnectedWalletAlreadyApprovedERC20: ", approved)
          setApprovedERC20(approved);
        }
      })
    */
    }, []);

    return (
        <React.Fragment>
            <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <StyledTableCell className="gridMoreArrow">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        <IconContext.Provider value={{ color: "black" }}>
                            {/*  specify the color for the arrow */}
                            {open ? (
                                <MdKeyboardArrowUp />
                            ) : (
                                <MdKeyboardArrowDown />
                            )}
                        </IconContext.Provider>
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                    <label className="mobileLabel">Title</label>
                    {item.ContractTitle}
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">Price (ETH)</label>
                    {item.Price}
                    <Image
                        src={tickerToIcon(item.CurrencyTicker)}
                        width={20}
                        height={20}
                        alt={item.CurrencyTicker}
                    />
                    {item.CurrencyTicker}
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">Time to Deliver</label>
                    {item.TimeToDeliver} Day(s)
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">Valid Until</label>
                    {wrapEpochToDate(item.OfferValidUntil)}
                </StyledTableCell>

                <StyledTableCell>
                    <input
                        className="button primary rounded" // button primary rounded small
                        type="submit"
                        value="Accept Offer"
                        onClick={ async() =>
                            AcceptOfferBuyer_Moralis(item.index, item.CurrencyTicker, (await GetWallet_NonMoralis())[0])
                                .then(async (transactionHash) => {

                                    // show the feedback text
                                    setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Pending",
                                        message: "Accepting offer...",
                                    });

                                    var formData = new FormData();
                                    formData.append("SellerWallet", item.SellerWallet);
                                    formData.append("PersonalizedOffer", "true");

                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("BuyerWallet", connectedAddress);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-acceptedOfferByBuyer", false);
                                    xhr.onload = function () {
                                      // show the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "offer accepted",
                                        transactionHash: transactionHash,
                                      });

                                      console.log("offer created");
                                    };
                                    xhr.send(formData);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    console.log("accept offer error code: " + error.code);
                                    console.log("accept offer error message: " + error.message);
                                    if (error.data && error.data.message) {
                                        setModelData({
                                            show: true,
                                            type: "alert",
                                            status: "Error",
                                            message: error.data.message,
                                        });
                                    } else {
                                        setModelData({
                                            show: true,
                                            type: "alert",
                                            status: "Error",
                                            message: error.message,
                                        });
                                    }
                                    process.exitCode = 1;
                                })
                        }
                    ></input>
                </StyledTableCell>

                {/* OLD - org 
          <StyledTableCell>
            <input
              className="button primary rounded"
              type="submit"
              value="Accept Offer (buyer)"
              onClick={() =>
                AcceptOfferBuyer_Moralis(item.index)
                  .then(async (transactionHash) => {
                    // show the feedback text
                    document.getElementById("submitFeedback").style.display =
                      "inline";
                    document.getElementById("submitFeedback").innerText =
                      "Creating offer...";

                    var formData = new FormData();
                    formData.append("SellerWallet", item.SellerWallet);   

                    const connectedAddress = await GetWallet_NonMoralis();
                    formData.append("BuyerWallet", connectedAddress);
                    formData.append("transactionHash", transactionHash);
                    formData.append("objectId", item.objectId);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "/api/api-acceptedOfferByBuyer", false);
                    xhr.onload = function () {
                      // update the feedback text
                      document.getElementById("submitFeedback").style.display =
                        "inline";
                      document.getElementById("submitFeedback").innerText =
                        "offer accepted";

                      // prevent the Submit button to be clickable and functionable
                      // removeHover()
                      // document.getElementById('SubmitButton').disabled = true

                      // think about also removing the hover effect
                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                      console.log("offer created");
                    };
                    xhr.send(formData);
                  })
                  .catch((error) => {
                    console.error(error);
                    console.log("accept offer error code: " + error.code);
                    console.log("accept offer error message: " + error.message);
                    if (error.data && error.data.message) {
                      document.getElementById("submitFeedback").innerText =
                        error.data.message;
                    } else {
                      document.getElementById("submitFeedback").innerText =
                        error.message;
                    }
                    document.getElementById("submitFeedback").style.visibility =
                      "visible";
                    process.exitCode = 1;
                  })
              }
            ></input>
          </StyledTableCell>
        */}
            </StyledTableRow>

            <TableRow>
                <StyledInnerTableCell></StyledInnerTableCell>
                <StyledInnerTableCell>Seller Wallet</StyledInnerTableCell>
                <StyledInnerTableCell>{item.SellerWallet}</StyledInnerTableCell>
            </TableRow>

            <StyledTableRow>
                <StyledTableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div className="listData">
                                <div className="listDataItem">
                                    <div className="listItemLabel">
                                        Seller Wallet
                                    </div>
                                    <div className="listItemValue">
                                        {item.SellerWallet}
                                    </div>
                                </div>
                                <div className="listDataItem">
                                    <div className="listItemLabel">
                                        Wallets Allowed to Accept
                                    </div>
                                    <div className="listItemValue">
                                        {wrapPersonalized(
                                            item.PersonalizedOffer
                                        )}
                                    </div>
                                </div>
                                <div className="listDataItem">
                                    <div className="listItemLabel">
                                        Arbiters
                                    </div>
                                    <div className="listItemValue">
                                        {wrapArbiters(item.Arbiters)}
                                    </div>
                                </div>
                                <div className="listDataItem">
                                    <div className="listItemLabel">
                                        Description
                                    </div>
                                    <div className="listItemValue">
                                        {item.OfferDescription}
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Collapse>
                </StyledTableCell>
            </StyledTableRow>
        </React.Fragment>
    );
}
