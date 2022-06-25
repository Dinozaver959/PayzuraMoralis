import Link from "next/link";
import React, { useState, useEffect } from "react";
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
import Moralis from "moralis";
import {
  GetWallet_NonMoralis,
  HandleDispute_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import PlaceholderIc from "../components/icons/Placeholder";
import Button from "../components/ui/Button";

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

export default function ListAvailableOffers(props) {
  const [data, setData] = useState([]);

  // load options using API call
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();
    const data = await fetch(
      `./api/api-getDisputesToManage` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setData(json)); // uncomment this line to see the data in the console

    console.log(data);

    return data;
  }

  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();
  }, []);

  return (
    <>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>List of Disputes</h1>
        </div>

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>Vote on Disputes</h2>
            </div>
          </div>

          <div className="cardBody">
            {data && data[0] ? (
              <>
                <Table_normal data={data} />
              </>
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no Vote on Disputes.</h2>
                <div className="submitButtonOuter">
                  <Button
                    link="/createOffer"
                    classes={"button primary rounded"}
                  >
                    <span>Create Offer Now</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
              <StyledTableCell>Time to Deliver (hours)</StyledTableCell>
              <StyledTableCell>Valid Until</StyledTableCell>
              <StyledTableCell>Vote for Buyer</StyledTableCell>
              <StyledTableCell>Vote for Seller</StyledTableCell>
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
  );
}

function Row_normal(props) {
  const { item } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <IconContext.Provider value={{ color: "white" }}>
              {" "}
              {/*  specify the color for the arrow */}
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconContext.Provider>
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {item.OfferTitle}
        </StyledTableCell>
        <StyledTableCell>{item.Price}</StyledTableCell>
        <StyledTableCell>{item.TimeToDeliver}</StyledTableCell>
        <StyledTableCell>
          {wrapEpochToDate(item.OfferValidUntil)}
        </StyledTableCell>

        <StyledTableCell>
          <input
            className="button primary rounded"
            type="submit"
            value="Vote for buyer"
            onClick={() =>
              HandleDispute_Moralis(item.index, true)
                .then(async (ArbitersVoteConcluded) => {
                  // {transactionHash, ArbitersVoteConcluded}      /// NOT FORWARDING THE value correctly, no idea why

                  // show the feedback text
                  document.getElementById("submitFeedback").style.display =
                    "inline";
                  document.getElementById("submitFeedback").innerText =
                    "sending vote...";

                  var formData = new FormData();
                  formData.append("ArbiterAccount", Moralis.User.current().id);

                  const connectedAddress = await GetWallet_NonMoralis();
                  formData.append("ArbiterWallet", connectedAddress);
                  formData.append("votedForBuyer", "true");
                  formData.append(
                    "ArbitersVoteConcluded",
                    ArbitersVoteConcluded
                  ); /// maybe turn it into a string
                  //formData.append('transactionHash', transactionHash);
                  formData.append("objectId", item.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/api-votedOnDispute", false);
                  xhr.onload = function () {
                    // update the feedback text
                    document.getElementById("submitFeedback").style.display =
                      "inline";
                    document.getElementById("submitFeedback").innerText =
                      "vote registered";

                    // prevent the Submit button to be clickable and functionable
                    // removeHover()
                    // document.getElementById('SubmitButton').disabled = true

                    // think about also removing the hover effect
                    // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                    console.log("vote registered");
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

        <StyledTableCell>
          <input
            className="button secondary rounded"
            type="submit"
            value="Vote for seller"
            onClick={() =>
              HandleDispute_Moralis(item.index, false)
                .then(async (ArbitersVoteConcluded) => {
                  // {transactionHash, ArbitersVoteConcluded}

                  // show the feedback text
                  document.getElementById("submitFeedback").style.display =
                    "inline";
                  document.getElementById("submitFeedback").innerText =
                    "sending vote...";

                  var formData = new FormData();
                  formData.append("ArbiterAccount", Moralis.User.current().id);

                  const connectedAddress = await GetWallet_NonMoralis();
                  formData.append("ArbiterWallet", connectedAddress);
                  formData.append("votedForBuyer", "false");
                  formData.append(
                    "ArbitersVoteConcluded",
                    ArbitersVoteConcluded
                  ); /// maybe turn it into a string
                  //formData.append('transactionHash', transactionHash);
                  formData.append("objectId", item.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/api-votedOnDispute", false);
                  xhr.onload = function () {
                    // update the feedback text
                    document.getElementById("submitFeedback").style.display =
                      "inline";
                    document.getElementById("submitFeedback").innerText =
                      "vote registered";

                    // prevent the Submit button to be clickable and functionable
                    // removeHover()
                    // document.getElementById('SubmitButton').disabled = true

                    // think about also removing the hover effect
                    // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                    console.log("vote registered");
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
      </StyledTableRow>

      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Description</StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {item.OfferDescription}
                    </StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Buyer Wallet</StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {item.BuyerWallet}
                    </StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Seller Wallet</StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {item.SellerWallet}
                    </StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>
                      Wallets Allowed to Accept
                    </StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {wrapPersonalized(item.PersonalizedOffer)}
                    </StyledInnerTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledInnerTableCell></StyledInnerTableCell>
                    <StyledInnerTableCell>Arbiters</StyledInnerTableCell>
                    <StyledInnerTableCell>
                      {wrapArbiters(item.Arbiters)}
                    </StyledInnerTableCell>
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