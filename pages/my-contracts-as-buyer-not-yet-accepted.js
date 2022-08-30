import React, { useState, useEffect, Fragment } from "react";
import { IconContext } from "react-icons";
import { useForm } from "react-hook-form";

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
  FundContract_Moralis,
  ApproveERC20_Moralis,
  UpdatePersonalizedOffer_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import PlaceholderIc from "../components/icons/Placeholder";
import LoadingPlaceholder from "../components/ui/LoadingPlaceholder";

import Image from "next/image";
import ETHIcon from "../components/images/ETH.webp";
import USDCIcon from "../components/images/USDC.webp";
import WalletAddressField from "../components/ui/WalletAddress-Input";
import EditIc from "../components/icons/Edit";
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

export default function ContractsCreatedByBuyer(props) {
  // maybe just call all 'Contracts' and that's it
  const [dataInitializedandPaid, setDataInitializedandPaid] = useState([]);
  const [dataAwaitSellerAccepts, setDataAwaitSellerAccepts] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);
  const [modelData, setModelData] = React.useState({ show: false, type: "alert", status: "Error", message: "" });

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }

  // load options using API call
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();
    const dataInitializedandPaid = await fetch(
      `./api/api-getPublicOffers_CreatedByBuyer_buyer_initialized_and_paid` +
        "?UserWallet=" +
        connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setDataInitializedandPaid(json));

    const dataAwaitSellerAccepts = await fetch(
      `./api/api-getPublicOffers_CreatedByBuyer_await_seller_accepts` +
        "?UserWallet=" +
        connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setDataAwaitSellerAccepts(json));

    console.log(dataInitializedandPaid);
    console.log(dataAwaitSellerAccepts);

    setPlaceholder(false);
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
        hasMenuDrawer={props.hasMenuDrawer}
        setMenuDrawer={props.setMenuDrawer}
        mobileDrawerFn={props.mobileDrawerFn}
        currentAccount={props.currentAccount}
        setCurrentAccount={props.setCurrentAccount}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Contracts Created as Buyer (not yet accepted by Seller)</h1>
        </div>

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>Contracts that have been funded already</h2>
              <p>Need to have the personalized Sellers set</p>
            </div>
          </div>
          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : dataInitializedandPaid[0] && dataInitializedandPaid ? (
              <Table_normal data={dataInitializedandPaid} setModelData={setModelData} />
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no contracts for you.</h2>
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

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>
                Contracts that have been funded already and Set personalized
                Sellers
              </h2>
              <p>
                can still update the personalized Sellers set or cancel (to be
                implemented)
              </p>
            </div>
          </div>
          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : dataAwaitSellerAccepts[0] && dataAwaitSellerAccepts ? (
              <Table_normal data={dataAwaitSellerAccepts} setModelData={setModelData} />
            ) : (
              <div className="noData">
                <i>
                  <PlaceholderIc />
                </i>
                <h2>There are no contracts for you.</h2>
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

      <ModalUi
        content={modelData}
        closeModelFn={closeModelDataHandler}
      />
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
  const { data, setModelData } = props;

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell />
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Price (ETH)</StyledTableCell>
              <StyledTableCell>Time to Deliver</StyledTableCell>
              <StyledTableCell>Valid Until</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <Row_normal key={item.id} item={item.name} setModelData={setModelData} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p id="submitFeedback" hidden></p>
    </>
  );
}

function Row_normal(props) {
  const { item, setModelData } = props;
  const [open, setOpen] = React.useState(false);
  const [approvedERC20, setApprovedERC20] = useState(false); // need to force update on   A) wallet change

  const { resetField } = useForm();
  const arPersonalizedOffer = item.PersonalizedOffer.split(",");
  const [personalizedToAdd, setPersonalizedToAdd] = React.useState("");
  const [personalizedToRemove, setPersonalizedToRemove] = React.useState("");
  const [personalizedOfferValue, setPersonalizedOfferValue] = React.useState(arPersonalizedOffer);
  const [errorPersonalizedOfferValue, setErrorPersonalizedOfferValue] = React.useState(false);
  const [isWalletsEditable, setIsWalletsEditable] = React.useState(false);

  function walletsEditableHandler() {
    setIsWalletsEditable(!isWalletsEditable);
    console.log(isWalletsEditable);
  }

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

  useEffect(() => {
    let personalizedOld = arPersonalizedOffer;
    let personalizedNew = personalizedOfferValue;
    setPersonalizedToAdd(
      personalizedNew.filter((x) => !personalizedOld.includes(x)).join(",")
    );
    setPersonalizedToRemove(
      personalizedOld.filter((x) => !personalizedNew.includes(x)).join(",")
    );
  }, [personalizedOfferValue]);

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
                  <div className="listItemLabel">Buyer Wallet</div>
                  <div className="listItemValue">{item.BuyerWallet}</div>
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

                <div className="listDataItem">
                  <div className="listItemLabel">Wallets Allowed to Accept</div>
                  <div className="listItemValue">
                    {isWalletsEditable === false ? (
                      <div className="walletListEditable">
                        <div className="listOfWallets">
                          {item.PersonalizedOffer &&
                            item.PersonalizedOffer.split(",").map(
                              (chip, i) =>
                                chip != "" && <span key={i}>{chip}</span>
                            )}
                        </div>
                        <div className="listAction">
                          <EditIc
                            size="22"
                            color="#2F499D"
                            onClick={walletsEditableHandler}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="editWalletsContainer">
                        <WalletAddressField
                          name="PersonalizedOffer"
                          inputValue={personalizedOfferValue}
                          setInputValue={setPersonalizedOfferValue}
                          errorValue={errorPersonalizedOfferValue}
                          setErrorValue={setErrorPersonalizedOfferValue}
                          // register={register}
                          resetField={resetField}
                        />
                        <div className="fieldError">
                          {errorPersonalizedOfferValue && (
                            <p>Invalid Wallet Address.</p>
                          )}
                        </div>
                        {/* ADD: <input
                      className="formInput"
                      id="personalizedToAdd"
                      type="text"
                      name="personalizedToAdd"
                    ></input>
                    <br></br>

                    REMOVE: <input
                      className="formInput"
                      id="personalizedToRemove"
                      type="text"
                      name="personalizedToRemove"
                    ></input>
                    */}
                        {/* <br></br> */}
                        <input
                          className="button primary rounded mt-15"
                          type="submit"
                          value="Update PersonalizedOffer"
                          onClick={() =>
                            UpdatePersonalizedOffer_Moralis(
                              item.index,
                              true,
                              personalizedToAdd, // document.getElementById("personalizedToAdd").value,
                              personalizedToRemove // document.getElementById("personalizedToRemove").value
                            )
                              .then(async (transactionHash) => {
                                setModelData({
                                  show: true,
                                  type: "alert",
                                  status: "Pending",
                                  message: "Updating Personalized...",
                                });

                                var formData = new FormData();
                                formData.append(
                                  "SellerWallet",
                                  item.SellerWallet
                                );
                                formData.append(
                                  "transactionHash",
                                  transactionHash
                                );
                                formData.append("isBuyer", "true");
                                formData.append(
                                  "PersonalizedToAdd",
                                  personalizedToAdd
                                ); //document.getElementById("personalizedToAdd").value);
                                formData.append(
                                  "PersonalizedToRemove",
                                  personalizedToRemove
                                ); // document.getElementById("personalizedToRemove").value);
                                formData.append("objectId", item.objectId);

                                var xhr = new XMLHttpRequest();
                                xhr.open(
                                  "POST",
                                  "/api/api-updatePersonalized",
                                  false
                                );
                                xhr.onload = function () {
                                  setModelData({
                                    show: true,
                                    type: "alert",
                                    status: "Success",
                                    message: "PersonalizedOffer updated",
                                    transactionHash: transactionHash,
                                  });
                                  console.log("personalizedOffer updated");
                                };
                                xhr.send(formData);
                              })
                              .catch((error) => {
                                console.error(error);
                                console.log(
                                  "accept offer error code: " + error.code
                                );
                                console.log(
                                  "accept offer error message: " + error.message
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
                      </div>
                    )}
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
