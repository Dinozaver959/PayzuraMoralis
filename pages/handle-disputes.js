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
import {
    GetWallet_NonMoralis,
    HandleDispute_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import PlaceholderIc from "../components/icons/Placeholder";
import Button from "../components/ui/Button";
import LoadingPlaceholder from "../components/ui/LoadingPlaceholder";
import PlusIc from "../components/icons/Plus";
import ModalUi from "../components/ui/ModalUi";

const StyledTableRow = styled(TableRow)();
const StyledTableCell = styled(TableCell)();

export default function ListAvailableOffers(props) {
    const [data, setData] = useState([]);
    const [placeholder, setPlaceholder] = useState(true);

    // load options using API call
    async function getCollectionsDetails() {
        const connectedAddress = await GetWallet_NonMoralis();
        const data = await fetch(`./api/api-getDisputesToManage` + "?UserWallet=" + connectedAddress)
            .then((res) => res.json())
            .then((json) => setData(json)); // uncomment this line to see the data in the console

        console.log(data);

        setPlaceholder(false);

        return data;
    }

    // Calling the function on component mount
    useEffect(() => {
        getCollectionsDetails();
    }, [props.currentAccount]);

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
              currentAccount={props.currentAccount}
              setCurrentAccount={props.setCurrentAccount}
            />

            <div className="containerMain">
                <div className="pageHeader">
                    <h1>Handle Disputes</h1>
                </div>

                <div className="card mt-10">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <h2>Vote on Disputes</h2>
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
                                <h2>There are no Vote on Disputes.</h2>
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
                    <label className="mobileLabel">Price (ETH)</label>
                    {item.Price}
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
                        className="button primary rounded small"
                        type="submit"
                        value="Vote for buyer"
                        onClick={() =>
                            HandleDispute_Moralis(item.index, true)
                                .then(async (ArbitersVoteConcluded) => {
                                    // {transactionHash, ArbitersVoteConcluded}      /// NOT FORWARDING THE value correctly, no idea why

                                    // show the feedback text
                                    setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Pending",
                                        message: "sending vote...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("ArbiterWallet", connectedAddress);
                                    formData.append("BuyerWallet", item.BuyerWallet);
                                    formData.append("SellerWallet", item.SellerWallet);
                                    formData.append("votedForBuyer", "true");
                                    formData.append("ArbitersVoteConcluded", ArbitersVoteConcluded); /// maybe turn it into a string
                                    //formData.append('transactionHash', transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open(
                                        "POST",
                                        "/api/api-votedOnDispute",
                                        false
                                    );
                                    xhr.onload = function () {
                                        // update the feedback text
                                        setModelData({
                                            show: true,
                                            type: "alert",
                                            status: "Success",
                                            message: "vote registered",
                                        });

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
                                    console.log(
                                        "accept offer error code: " + error.code
                                    );
                                    console.log(
                                        "accept offer error message: " +
                                            error.message
                                    );
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
                        className="button secondary rounded small"
                        type="submit"
                        value="Vote for seller"
                        onClick={() =>
                            HandleDispute_Moralis(item.index, false)
                                .then(async (ArbitersVoteConcluded) => {
                                    // show the feedback text
                                    setModelData({
                                        show: true,
                                        type: "alert",
                                        status: "Pending",
                                        message: "sending vote...",
                                    });

                                    var formData = new FormData();
                                    const connectedAddress = await GetWallet_NonMoralis();
                                    formData.append("ArbiterWallet", connectedAddress);
                                    formData.append("BuyerWallet", item.BuyerWallet);
                                    formData.append("SellerWallet", item.SellerWallet);
                                    formData.append("votedForBuyer", "false");
                                    formData.append("ArbitersVoteConcluded", ArbitersVoteConcluded); /// maybe turn it into a string
                                    //formData.append('transactionHash', transactionHash);
                                    formData.append("objectId", item.objectId);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open(
                                        "POST",
                                        "/api/api-votedOnDispute",
                                        false
                                    );
                                    xhr.onload = function () {
                                        // update the feedback text
                                        setModelData({
                                            show: true,
                                            type: "alert",
                                            status: "Success",
                                            message: "vote registered",
                                        });

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
                                    console.log(
                                        "accept offer error code: " + error.code
                                    );
                                    console.log(
                                        "accept offer error message: " +
                                            error.message
                                    );
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
            </StyledTableRow>

            <StyledTableRow>
                <StyledTableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div className="listData">
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
