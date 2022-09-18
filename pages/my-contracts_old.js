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
    ReturnPayment_Moralis,
    ClaimFunds_Moralis,
    StartDispute_Moralis,
    ConfirmDelivery_Moralis,
    CancelBuyerContract_Moralis,
    CancelSellerContract_Moralis
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

function wrapArbiters(wallets) {
    if (!wallets) {
        return "Payzura Platform";
    } else {
        return wallets.replaceAll(",", "\n");
    }
}

function wrapDelegates(wallets) {
    if (!wallets) {
        return "";
    } else {
        return wallets.replaceAll(",", "\n");
    }
}

function tickerToIcon(ticker) {
    if (ticker == "USDC") {
        return USDCIcon;
    } else if (ticker == "ETH") {
        return ETHIcon;
    }
}

export default function MyAgreements(props) {
    const [data, setData] = useState([]);
    const [dataOnlyBuyer, setDataOnlyBuyer] = useState([]);
    const [dataOnlySeller, setDataOnlySeller] = useState([]);
    const [placeholder, setPlaceholder] = useState(true);

    // load options using API call
    async function getCollectionsDetails() {
        // setPlaceholder(true);
        const connectedAddress = await GetWallet_NonMoralis();
        // const data = await fetch(`./api/api-getUserAgreements`)   /// append user wallet
        const data = await fetch(`./api/api-getUserAgreements` + "?UserWallet=" + connectedAddress)
            .then((res) => res.json())
            .then((json) => setData(json));

        const dataOnlyBuyer = await fetch(`./api/api-getUserAgreementsOnlyBuyer` + "?UserWallet=" + connectedAddress)
            .then((res) => res.json())
            .then((json) => setDataOnlyBuyer(json));

        const dataOnlySeller = await fetch(`./api/api-getUserAgreementsOnlySeller` + "?UserWallet=" + connectedAddress)
            .then((res) => res.json())
            .then((json) => setDataOnlySeller(json));
        setPlaceholder(false);

        console.log("data:");
        console.log(data);
        console.log("dataOnlyBuyer:");
        console.log(dataOnlyBuyer);
        console.log("dataOnlySeller:");
        console.log(dataOnlySeller);
        return data;
    }

    // Calling the function on component mount
    useEffect(() => {
        getCollectionsDetails();
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
                    <h1>My Contracts:{props.darkMode}</h1>
                </div>

                <div className="card mt-10">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <h2>My Contracts as Buyer</h2>
                        </div>
                    </div>

                    <div className="cardBody">
                        {placeholder ? (
                            <div className="blockLoading">
                                <LoadingPlaceholder
                                    extraStyles={{ position: "absolute" }}
                                />
                            </div>
                        ) : dataOnlyBuyer[0] && dataOnlyBuyer ? (
                            <Table_normal data={dataOnlyBuyer} isBuyer={true} />
                        ) : (
                            <div className="noData">
                                <i>
                                    <PlaceholderIc />
                                </i>
                                <h2>There are no available contracts.</h2>
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

                <div className="card mt-10">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <h2>My Contracts as Seller</h2>
                        </div>
                    </div>

                    <div className="cardBody">
                        {placeholder ? (
                            <div className="blockLoading">
                                <LoadingPlaceholder
                                    extraStyles={{ position: "absolute" }}
                                />
                            </div>
                        ) : dataOnlySeller[0] && dataOnlySeller ? (
                            <Table_normal
                                data={dataOnlySeller}
                                isBuyer={false}
                            />
                        ) : (
                            <div className="noData">
                                <i>
                                    <PlaceholderIc />
                                </i>
                                <h2>There are no available contracts.</h2>
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

function Table_normal(props) {
    const { data, isBuyer } = props;

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
                            <StyledTableCell>State</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>
                                Time to Deliver (hours)
                            </StyledTableCell>

                            {isBuyer ? (
                                <>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </>
                            ) : (
                                <>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </>
                            )}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <Row_normal
                                key={item.id}
                                item={item.name}
                                isBuyer={isBuyer}
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
    const { item, isBuyer, setModelData } = props;
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
                    <label className="mobileLabel">State</label>
                    {item.State}
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">Price</label>
                    <div className="flex-center">
                        {item.Price}
                        <i className="currencyIc ml-10 mr-5">
                            <Image
                                src={tickerToIcon(item.CurrencyTicker)}
                                width={22}
                                height={22}
                                alt={item.CurrencyTicker}
                            />
                        </i>
                        {item.CurrencyTicker}
                    </div>
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">
                        Time to Deliver (hours)
                    </label>
                    {item.TimeToDeliver}
                </StyledTableCell>

                    
                {(item.State == 'complete' || item.State == 'canceled' || item.State == 'dispute') ?(
                  <>
                      {/* NO BUTTONS */}
                  </>
                ) : (
                  <>
                    {isBuyer ? (
                      (item.State == 'await_payment' || item.State == 'buyer_initialized_and_paid' || item.State == 'await_seller_accepts' || item.State == 'Available') ? (
                        // show a cancel button (RED COLOR)
                        <>
                          <StyledTableCell>
                            <input
                              className="rounded button red small"
                              type="submit"
                              value="Cancel Contract"
                              onClick={() =>
                                CancelBuyerContract_Moralis(item.index)
                                  .then(async (transactionHash) => {
                                    // show the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Pending",
                                      message: "Canceling contract...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("userWallet", connectedAddress);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-cancelContract", false);
                                    xhr.onload = function () {
                                      // update the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "contract canceled",
                                        transactionHash: transactionHash,
                                      });

                                      // prevent the Submit button to be clickable and functionable
                                      // removeHover()
                                      // document.getElementById('SubmitButton').disabled = true

                                      // think about also removing the hover effect
                                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                      console.log("contract canceled");
                                    };
                                    xhr.send(formData);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    console.log("accept Offer error code: " + error.code);
                                    console.log("accept Offer error message: " + error.message);
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
                        </>
                      ) : (
                        <>
                          <StyledTableCell>
                            <input
                              className="rounded button green small"
                              type="submit"
                              value="Start Dispute"
                              onClick={() =>
                                StartDispute_Moralis(item.index)
                                .then(async (transactionHash) => {
                                  // show the feedback text
                                  setModelData({
                                    show: true,
                                    type: "alert",
                                    status: "Pending",
                                    message: "Starting Dispute...",
                                  });

                                  var formData = new FormData();
                                  const connectedAddress = await GetWallet_NonMoralis();
                                  formData.append("BuyerWallet", connectedAddress);
                                  formData.append("SellerWallet", item.SellerWallet);
                                  formData.append("transactionHash", transactionHash);
                                  formData.append("objectId", item.objectId);

                                  var xhr = new XMLHttpRequest();
                                  xhr.open("POST", "/api/api-startDispute", false);
                                  xhr.onload = function () {
                                    // update the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Success",
                                      message: "Dispute started",
                                      transactionHash: transactionHash,
                                    });

                                    // prevent the Submit button to be clickable and functionable
                                    // removeHover()
                                    // document.getElementById('SubmitButton').disabled = true

                                    // think about also removing the hover effect
                                    // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                    console.log("Dispute started");
                                  };
                                  xhr.send(formData);
                                })
                                .catch((error) => {
                                  console.error(error);
                                  console.log("accept Offer error code: " + error.code);
                                  console.log("accept Offer error message: " + error.message);
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

                            <input
                              className="button rounded secondary small"
                              type="submit"
                              value="Confirm Delivery"
                              onClick={() =>
                                ConfirmDelivery_Moralis(item.index)
                                  .then(async (transactionHash) => {
                                    // show the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Pending",
                                      message: "Confirming Delivery...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("BuyerWallet", connectedAddress);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-confirmDelivery", false);
                                    xhr.onload = function () {
                                      // update the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "Delivery confirmed",
                                        transactionHash: transactionHash,
                                      });

                                      // prevent the Submit button to be clickable and functionable
                                      // removeHover()
                                      // document.getElementById('SubmitButton').disabled = true

                                      // think about also removing the hover effect
                                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                      console.log("Delivery confirmed");
                                    };
                                    xhr.send(formData);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    console.log("accept Offer error code: " + error.code);
                                    console.log("accept Offer error message: " + error.message);
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
                        </>
                      )
                    ) : (
                      (item.State == 'await_payment' || item.State == 'buyer_initialized_and_paid' || item.State == 'await_seller_accepts' || item.State == 'Available') ? (
                        // show a cancel button (RED COLOR)
                        <>
                          <StyledTableCell>
                            <input
                              className="rounded button red small"
                              type="submit"
                              value="Cancel Contract"
                              onClick={() =>
                                CancelSellerContract_Moralis(item.index)
                                  .then(async (transactionHash) => {
                                    // show the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Pending",
                                      message: "Canceling contract...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("userWallet", connectedAddress);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-cancelContract", false);
                                    xhr.onload = function () {
                                      // update the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "contract canceled",
                                        transactionHash: transactionHash,
                                      });

                                      // prevent the Submit button to be clickable and functionable
                                      // removeHover()
                                      // document.getElementById('SubmitButton').disabled = true

                                      // think about also removing the hover effect
                                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                      console.log("contract canceled");
                                    };
                                    xhr.send(formData);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    console.log("accept Offer error code: " + error.code);
                                    console.log("accept Offer error message: " + error.message);
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
                        </>
                      ) : (
                        <>
                          <StyledTableCell>
                            <input
                              className="button primary rounded small"
                              type="submit"
                              value="Return Payment"
                              onClick={() =>
                                ReturnPayment_Moralis(item.index)
                                  .then(async (transactionHash) => {
                                    // show the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Pending",
                                      message: "Returning payment...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("SellerWallet", connectedAddress);
                                    formData.append("BuyerWallet", item.buyerWallet);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-returnPayment", false);
                                    xhr.onload = function () {
                                      // update the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "Payment returned",
                                        transactionHash: transactionHash,
                                      });

                                      // prevent the Submit button to be clickable and functionable
                                      // removeHover()
                                      // document.getElementById('SubmitButton').disabled = true

                                      // think about also removing the hover effect
                                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                      console.log("Payment returned");
                                    };
                                    xhr.send(formData);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    console.log("accept Offer error code: " + error.code);
                                    console.log("accept Offer error message: " + error.message);
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

                            <input
                              className="button rounded orange small"
                              type="submit"
                              value="Claim funds"
                              onClick={() =>
                                ClaimFunds_Moralis(item.index)
                                  .then(async (transactionHash) => {
                                    // show the feedback text
                                    setModelData({
                                      show: true,
                                      type: "alert",
                                      status: "Pending",
                                      message: "Claiming Funds...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("SellerWallet", connectedAddress);
                                    formData.append("transactionHash", transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open("POST", "/api/api-claimFunds", false);
                                    xhr.onload = function () {
                                      // update the feedback text
                                      setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Success",
                                        message: "Funds claimed",
                                        transactionHash: transactionHash,
                                      });

                                      // prevent the Submit button to be clickable and functionable
                                      // removeHover()
                                      // document.getElementById('SubmitButton').disabled = true

                                      // think about also removing the hover effect
                                      // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                      console.log("Funds claimed");
                                    };
                                    xhr.send(formData);
                                  })
                                  .catch((error) => {
                                    console.error(error);
                                    console.log("accept Offer error code: " + error.code);
                                    console.log("accept Offer error message: " + error.message);
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
                        </>
                      )
                    )} 
                  </>
                )}              
              
            </StyledTableRow>

            <StyledTableRow>
                <StyledTableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}
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
                                        Buyer Wallet
                                    </div>
                                    <div className="listItemValue">
                                        {item.BuyerWallet}
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
                                        BuyerDelegates
                                    </div>
                                    <div className="listItemValue">
                                        {wrapDelegates(item.BuyerDelegates)}
                                        {/*
                    Needs to be adjusted:  
                      1. Display addresses 1 per row - have the ability to click X to delete an array and add a new address with a plus
                      2. Create 2 arrays, 1 with addresses that were removed and 1 with addresses that were added
                      3. feed these 2 arrays for the function and for the push /api call
                  */}
                                        <input
                                            className="rounded button primary"
                                            type="submit"
                                            value="Update Buyer Delegates"
                                            onClick={() =>
                                                UpdateDelegates_Moralis(
                                                    item.index,
                                                    true,
                                                    "__array_DelegatesToAdd__",
                                                    "__array_DelegatesToRemove__"
                                                ) // UPDATE with real values                                                          // supply the arrays somehow
                                                    .then(
                                                        async (
                                                            transactionHash
                                                        ) => {
                                                            // show the feedback text
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Pending",
                                                                message:
                                                                    "Updating Delegates...",
                                                            });

                                                            var formData =
                                                                new FormData();

                                                            const connectedAddress =
                                                                await GetWallet_NonMoralis();
                                                            formData.append(
                                                                "BuyerWallet",
                                                                connectedAddress
                                                            );
                                                            formData.append(
                                                                "objectId",
                                                                item.objectId
                                                            );
                                                            formData.append(
                                                                "areForBuyer",
                                                                "true"
                                                            );
                                                            formData.append(
                                                                "DelegatesToAdd",
                                                                "______________________"
                                                            ); // array                                // UPDATE with real values
                                                            formData.append(
                                                                "DelegatesToRemove",
                                                                "______________________"
                                                            ); // array                                // UPDATE with real values

                                                            var xhr =
                                                                new XMLHttpRequest();
                                                            xhr.open(
                                                                "POST",
                                                                "/api/api-updateDelegates",
                                                                false
                                                            );
                                                            xhr.onload =
                                                                function () {
                                                                    // update the feedback text
                                                                    setModelData(
                                                                        {
                                                                            show: true,
                                                                            type: "alert",
                                                                            status: "Success",
                                                                            message: "Delegates updated",
                                                                            transactionHash: transactionHash,
                                                                        }
                                                                    );
                                                                    console.log(
                                                                        "Delegates updated"
                                                                    );
                                                                };
                                                            xhr.send(formData);
                                                        }
                                                    )
                                                    .catch((error) => {
                                                        console.error(error);
                                                        console.log(
                                                            "update Delegates error code: " +
                                                                error.code
                                                        );
                                                        console.log(
                                                            "update Delegates error message: " +
                                                                error.message
                                                        );
                                                        if (
                                                            error.data &&
                                                            error.data.message
                                                        ) {
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Error",
                                                                message:
                                                                    error.data
                                                                        .message,
                                                            });
                                                        } else {
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Error",
                                                                message:
                                                                    error.message,
                                                            });
                                                        }
                                                        process.exitCode = 1;
                                                    })
                                            }
                                        ></input>
                                    </div>
                                </div>
                                <div className="listDataItem">
                                    <div className="listItemLabel">
                                        SellerDelegates
                                    </div>
                                    <div className="listItemValue">
                                        {wrapDelegates(item.SellerDelegates)}
                                        {/*
                  Needs to be adjusted:  
                    1. Display addresses 1 per row - have the ability to click X to delete an array and add a new address with a plus
                    2. Create 2 arrays, 1 with addresses that were removed and 1 with addresses that were added
                    3. feed these 2 arrays for the function and for the push /api call
                */}
                                        <input
                                            className="rounded button primary"
                                            type="submit"
                                            value="Update Seller Delegates"
                                            onClick={() =>
                                                UpdateDelegates_Moralis(
                                                    item.index,
                                                    false,
                                                    "__array_DelegatesToAdd__",
                                                    "__array_DelegatesToRemove__"
                                                ) // UPDATE with real values                                                     // supply the arrays somehow
                                                    .then(
                                                        async (
                                                            transactionHash
                                                        ) => {
                                                            // show the feedback text
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Pending",
                                                                message:
                                                                    "Updating Delegates...",
                                                            });

                                                            var formData =
                                                                new FormData();

                                                            const connectedAddress =
                                                                await GetWallet_NonMoralis();
                                                            formData.append(
                                                                "BuyerWallet",
                                                                connectedAddress
                                                            );
                                                            formData.append(
                                                                "objectId",
                                                                item.objectId
                                                            );
                                                            formData.append(
                                                                "areForBuyer",
                                                                "false"
                                                            );
                                                            formData.append(
                                                                "DelegatesToAdd",
                                                                "______________________"
                                                            ); // array                                      // UPDATE with real values
                                                            formData.append(
                                                                "DelegatesToRemove",
                                                                "______________________"
                                                            ); // array                                      // UPDATE with real values

                                                            var xhr =
                                                                new XMLHttpRequest();
                                                            xhr.open(
                                                                "POST",
                                                                "/api/api-updateDelegates",
                                                                false
                                                            );
                                                            xhr.onload =
                                                                function () {
                                                                    // update the feedback text
                                                                    setModelData(
                                                                        {
                                                                            show: true,
                                                                            type: "alert",
                                                                            status: "Success",
                                                                            message: "Delegates updated",
                                                                            transactionHash: transactionHash,
                                                                        }
                                                                    );
                                                                    console.log(
                                                                        "Delegates updated"
                                                                    );
                                                                };
                                                            xhr.send(formData);
                                                        }
                                                    )
                                                    .catch((error) => {
                                                        console.error(error);
                                                        console.log(
                                                            "update Delegates error code: " +
                                                                error.code
                                                        );
                                                        console.log(
                                                            "update Delegates error message: " +
                                                                error.message
                                                        );
                                                        if (
                                                            error.data &&
                                                            error.data.message
                                                        ) {
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Error",
                                                                message:
                                                                    error.data
                                                                        .message,
                                                            });
                                                        } else {
                                                            setModelData({
                                                                show: true,
                                                                type: "alert",
                                                                status: "Error",
                                                                message:
                                                                    error.message,
                                                            });
                                                        }
                                                        process.exitCode = 1;
                                                    })
                                            }
                                        ></input>
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
