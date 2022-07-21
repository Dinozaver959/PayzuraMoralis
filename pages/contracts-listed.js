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
    ApproveERC20_Moralis,
    PayERC20__TEST__Moralis,
    PayERC20__TEST__WO_Moralis,
    PayERC20__transfer__Moralis,
    PayERC20__transfer__direct_USDC,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import LoadingPlaceholder from "./../components/ui/LoadingPlaceholder";

import PlusIc from "../components/icons/Plus";
import PlaceholderIc from "../components/icons/Placeholder";
import ModalUi from "../components/ui/ModalUi";

import Image from "next/image";
import ETHIcon from "../components/images/ETH.webp";
import USDCIcon from "../components/images/USDC.webp";

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

export default function ContractsListed(props) {
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
                    <h1>Contracts Listed</h1>
                    <div className="headerAction">
                        <Button
                            link="/personalized-contracts"
                            classes={"button green rounded"}
                        >
                            <span>Personalized Contracts</span>
                        </Button>
                    </div>
                </div>

                <div className="card mt-10">
                    <div className="cardHeader">
                        <div className="cardTitle">
                            <h2>Open Contracts</h2>
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
                                <h2>There are no available contracts.</h2>
                                <div className="submitButtonOuter">
                                    <Button
                                        link="/create-contract"
                                        classes={"button primary rounded"}
                                    >
                                        <span>Create Contract Now</span>
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
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Time to Deliver</StyledTableCell>
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
                {/* <StyledTableCell>
          <label className="mobileLabel">Currency</label>
          <div className="flex-center">
            <i className="currencyIc">
              <Image
                src={tickerToIcon(item.CurrencyTicker)}
                width={28}
                height={28}
                alt={item.CurrencyTicker}
              />
            </i>
            {item.CurrencyTicker}
          </div>
        </StyledTableCell> */}
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
                    <label className="mobileLabel">Time to Deliver</label>
                    {item.TimeToDeliver} H
                </StyledTableCell>
                <StyledTableCell>
                    <label className="mobileLabel">Valid Until</label>
                    {wrapEpochToDate(item.OfferValidUntil)}
                </StyledTableCell>

                {/* only show Approve button if the currency is not ETH */}
                {/* 
            later it will be more advanced: check if user has already approved the currency or not:
            if not:  show only the approve button, on successful approval:  change the button to the aceept offer button
            if yes: directly show only the accept offer button
          */}
                {/*
            // || approvedERC20) ? 
            // ) ? 
            // ||  new Promise((resolve, reject) => { hasTheConnectedWalletAlreadyApprovedERC20(item.ApprovedBy)})   ) ?         
            // ||  await hasTheConnectedWalletAlreadyApprovedERC20(item.ApprovedBy)  ) ?   
          */}
                {item.CurrencyTicker == "ETH" || approvedERC20 ? (
                    <>
                        <StyledTableCell>
                            <input
                                className="button primary rounded small"
                                type="submit"
                                value="Accept Offer"
                                onClick={() =>
                                    AcceptOffer_Moralis(
                                        item.index,
                                        item.CurrencyTicker
                                    ) // PayERC20__transfer__Moralis()
                                        .then(async (transactionHash) => {
                                            setModelData({
                                                show: true,
                                                type: "alert",
                                                status: "Pending",
                                                message: "Creating offer...",
                                            });

                                            var formData = new FormData();
                                            formData.append(
                                                "BuyerAccount",
                                                Moralis.User.current().id
                                            );
                                            formData.append(
                                                "SellerWallet",
                                                item.SellerWallet
                                            );

                                            const connectedAddress =
                                                await GetWallet_NonMoralis();
                                            formData.append(
                                                "BuyerWallet",
                                                connectedAddress
                                            );
                                            formData.append(
                                                "transactionHash",
                                                transactionHash
                                            );
                                            formData.append(
                                                "objectId",
                                                item.objectId
                                            );

                                            var xhr = new XMLHttpRequest();
                                            xhr.open(
                                                "POST",
                                                "/api/api-acceptedOffer",
                                                false
                                            );
                                            xhr.onload = function () {
                                                // setModelData({
                                                //   show: true,
                                                //   type: "alert",
                                                //   status: "Success",
                                                //   message: "offer accepted",
                                                // });

                                                setModelData({
                                                    show: true,
                                                    type: "alert",
                                                    status: "Pending",
                                                    message:
                                                        "Accepting offer...",
                                                });

                                                var formData = new FormData();
                                                formData.append(
                                                    "BuyerAccount",
                                                    Moralis.User.current().id
                                                );

                                                console.log("offer created");
                                            };
                                            xhr.send(formData);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            console.log(
                                                "accept offer error code: " +
                                                    error.code
                                            );
                                            console.log(
                                                "accept offer error message: " +
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
                        {/* don't show approval button */}
                    </>
                ) : (
                    <>
                        <StyledTableCell>
                            <input
                                className="button primary rounded small"
                                type="submit"
                                value="Accept Offer"
                                onClick={() =>
                                    AcceptOffer_Moralis(
                                        item.index,
                                        item.CurrencyTicker
                                    ) // PayERC20__transfer__Moralis()
                                        .then(async (transactionHash) => {
                                            setModelData({
                                                show: true,
                                                type: "alert",
                                                status: "Pending",
                                                message: "Creating offer...",
                                            });

                                            var formData = new FormData();
                                            formData.append(
                                                "BuyerAccount",
                                                Moralis.User.current().id
                                            );
                                            formData.append(
                                                "SellerWallet",
                                                item.SellerWallet
                                            );

                                            const connectedAddress =
                                                await GetWallet_NonMoralis();
                                            formData.append(
                                                "BuyerWallet",
                                                connectedAddress
                                            );
                                            formData.append(
                                                "transactionHash",
                                                transactionHash
                                            );
                                            formData.append(
                                                "objectId",
                                                item.objectId
                                            );

                                            var xhr = new XMLHttpRequest();
                                            xhr.open(
                                                "POST",
                                                "/api/api-acceptedOffer",
                                                false
                                            );
                                            xhr.onload = function () {
                                                // setModelData({
                                                //   show: true,
                                                //   type: "alert",
                                                //   status: "Success",
                                                //   message: "offer accepted",
                                                // });

                                                setModelData({
                                                    show: true,
                                                    type: "alert",
                                                    status: "Pending",
                                                    message:
                                                        "Accepting offer...",
                                                });

                                                var formData = new FormData();
                                                formData.append(
                                                    "BuyerAccount",
                                                    Moralis.User.current().id
                                                );

                                                // think about also removing the hover effect
                                                // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                                console.log("offer created");
                                            };
                                            xhr.send(formData);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            console.log(
                                                "accept offer error code: " +
                                                    error.code
                                            );
                                            console.log(
                                                "accept offer error message: " +
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
                                className="button green rounded small"
                                type="submit"
                                /* value="Approve USDC" */
                                value={"Approve " + item.CurrencyTicker}
                                onClick={() => {
                                    ApproveERC20_Moralis(item.index)
                                        .then(async (transactionHash) => {
                                            console.log(
                                                "approval for ERC20 successfully completed"
                                            );
                                            console.log(
                                                "transactionHash: ",
                                                transactionHash
                                            );

                                            // hide approve button
                                            setApprovedERC20(true);

                                            var formData = new FormData();
                                            formData.append(
                                                "BuyerAccount",
                                                Moralis.User.current().id
                                            );

                                            const connectedAddress =
                                                await GetWallet_NonMoralis();
                                            formData.append(
                                                "BuyerWallet",
                                                connectedAddress
                                            );
                                            formData.append(
                                                "transactionHash",
                                                transactionHash
                                            );
                                            formData.append(
                                                "objectId",
                                                item.objectId
                                            );

                                            var xhr = new XMLHttpRequest();
                                            xhr.open(
                                                "POST",
                                                "/api/api-approvedERC20",
                                                false
                                            );
                                            xhr.onload = function () {
                                                setModelData({
                                                    show: true,
                                                    type: "alert",
                                                    status: "Pending",
                                                    message:
                                                        "granting approval...",
                                                });

                                                var formData = new FormData();
                                                formData.append(
                                                    "BuyerAccount",
                                                    Moralis.User.current().id
                                                );

                                                // think about also removing the hover effect
                                                // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
                                                console.log("approval granted");
                                            };
                                            xhr.send(formData);
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            console.log(
                                                "approval error code: " +
                                                    error.code
                                            );
                                            console.log(
                                                "approval error message: " +
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
                                        });
                                }}
                            ></input>
                        </StyledTableCell>
                    </>
                )}
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
                                        Seller Wallet
                                    </div>
                                    <div className="listItemValue">
                                        {item.SellerWallet}
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
