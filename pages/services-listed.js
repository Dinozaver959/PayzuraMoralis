// import Link from "next/link";
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
  AcceptOffer_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import LoadingPlaceholder from "./../components/ui/LoadingPlaceholder";

import PlusIc from "../components/icons/Plus";
import PlaceholderIc from "../components/icons/Placeholder";
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

export default function ServicesListed(props) {
  const [data, setData] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);

  // load options using API call
  async function getCollectionsDetails() {
    const data = await fetch(`./api/api-getPublicOffers`)
      .then((res) => res.json())
      .then((json) => setData(json)); // uncomment this line to see the data in the console

    console.log(data);

    setPlaceholder(false);
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
        hasMenuDrawer={props.hasMenuDrawer}
        setMenuDrawer={props.setMenuDrawer}
        mobileDrawerFn={props.mobileDrawerFn}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Services Listed</h1>
          <div className="headerAction">
            <Button link="/personalized-services" classes={"button green"}>
              <span>Personalized Services</span>
            </Button>
            <Button link="/create-offer" classes={"button secondary withIcon"}>
              <i>
                <PlusIc />
              </i>
              <span>Create New Offer</span>
            </Button>
          </div>
        </div>

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>Open Offers</h2>
            </div>
          </div>

          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : data[0] && data ? (
              <Table_normal data={data} />
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no available offers.</h2>
                <div className="submitButtonOuter">
                  <Button
                    link="/create-offer"
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
  const [modelData, setModelData] = useState({
    show: false,
    type: "success",
    title: "title1",
    message: "message1",
  });

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
              <StyledTableCell>Accept Offer</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <Row_normal key={item.id} item={item.name} setModelData={setModelData} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p id="submitFeedback" className="alertMessage"></p>
      <ModalUi content={modelData} />
    </>
  );
}

function Row_normal(props) {
  const { item, setModelData } = props;
  const [open, setOpen] = React.useState(false);

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
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconContext.Provider>
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <label className="mobileLabel">Title</label>
          {item.OfferTitle}
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">Price (ETH)</label>
          {item.Price}
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">Time to Deliver (hours)</label>
          {item.TimeToDeliver}
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">Valid Until</label>
          {wrapEpochToDate(item.OfferValidUntil)}
        </StyledTableCell>

        <StyledTableCell>
          <input
            className="button primary rounded"
            type="submit"
            value="Accept Offer (buyer)"
            onClick={() =>
              AcceptOffer_Moralis(item.index)
                .then(async (transactionHash) => {
                  // show the feedback text
                  document.getElementById("submitFeedback").style.display =
                    "inline";
                  document.getElementById("submitFeedback").setModelData({show: true,type: "success",title: "title1",message: "Creating offer..."});

                  var formData = new FormData();
                  formData.append("BuyerAccount", Moralis.User.current().id);
                  formData.append("SellerWallet", item.SellerWallet);

                  const connectedAddress = await GetWallet_NonMoralis();
                  formData.append("BuyerWallet", connectedAddress);
                  formData.append("transactionHash", transactionHash);
                  formData.append("objectId", item.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/api-acceptedOffer", false);
                  xhr.onload = function () {
                    // update the feedback text
                    document.getElementById("submitFeedback").style.display =
                      "inline";
                    document.getElementById("submitFeedback").innerText =
                      "offer accepted";

                    // show the feedback text
                    document.getElementById("submitFeedback").style.display =
                      "inline";
                    document.getElementById("submitFeedback").innerText =
                      "Accepting offer...";

                    var formData = new FormData();
                    formData.append("BuyerAccount", Moralis.User.current().id);

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
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="listData">
                <div className="listDataItem">
                  <div className="listItemLabel">Wallets Allowed to Accept</div>
                  <div className="listItemValue">
                    {wrapPersonalized(item.PersonalizedOffer)}
                  </div>
                </div>
                <div className="listDataItem">
                  <div className="listItemLabel">Seller Wallet</div>
                  <div className="listItemValue">{item.SellerWallet}</div>
                </div>
                <div className="listDataItem">
                  <div className="listItemLabel">Arbiters</div>
                  <div className="listItemValue">
                    {wrapArbiters(item.Arbiters)}
                  </div>
                </div>
                <div className="listDataItem">
                  <div className="listItemLabel">Description</div>
                  <div className="listItemValue">{item.OfferDescription}</div>
                </div>
              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}
