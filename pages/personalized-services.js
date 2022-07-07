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
import Moralis from "moralis";
import {
  GetWallet_NonMoralis,
  AcceptOffer_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import PlaceholderIc from "../components/icons/Placeholder";
import PlusIc from "../components/icons/Plus";
import LoadingPlaceholder from "../components/ui/LoadingPlaceholder";

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

export default function PersonalizedServices(props) {
  const [data, setData] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);

  // load options using API call
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();
    const data = await fetch(
      `./api/api-getPersonalizedOffers` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setData(json));

    console.log(data);

    return data;
  }

  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();

    setTimeout(() => {
      setPlaceholder(false);
    }, 1200);
  }, []);

  return (
    <Fragment>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Personalized Services Listed</h1>
          <div className="headerAction">
            <Button
              link="/create-offer"
              classes={"button secondary withIcon"}
            >
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
              <h2>Hey UserName, Here are some offers for you!</h2>
              <p>
                Loreim ipsum dummy text, this is loreim ipsum dummy content.
              </p>
            </div>
          </div>
          <div className="cardBody">
            {data[0] && data ? (
              <>
                <Table_normal data={data} />
                {placeholder && (
                  <div className="blockLoading">
                    <LoadingPlaceholder
                      extraStyles={{ height: "100%", position: "absolute" }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no offers for you.</h2>
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
              <StyledTableCell>Accept Offer</StyledTableCell>
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
            <IconContext.Provider value={{ color: "black" }}>
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
            value="Accept Offer (buyer)"
            onClick={() =>
              AcceptOffer_Moralis(item.index)
                .then(async (transactionHash) => {
                  // show the feedback text
                  document.getElementById("submitFeedback").style.display =
                    "inline";
                  document.getElementById("submitFeedback").innerText =
                    "Creating offer...";

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
                  <div className="listItemLabel">Seller Wallet</div>
                  <div className="listItemValue">{item.SellerWallet}</div>
                </div>
                <div className="listDataItem">
                  <div className="listItemLabel">Wallets Allowed to Accept</div>
                  <div className="listItemValue">
                    {wrapPersonalized(item.PersonalizedOffer)}
                  </div>
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
