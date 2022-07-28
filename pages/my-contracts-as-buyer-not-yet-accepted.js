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
  FundContract_Moralis,
  ApproveERC20_Moralis,
  UpdatePersonalizedOffer_Moralis
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";
import Button from "../components/ui/Button";
import PlaceholderIc from "../components/icons/Placeholder";
import LoadingPlaceholder from "../components/ui/LoadingPlaceholder";

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

export default function ContractsCreatedByBuyer(props) {    // maybe just call all 'Contracts' and that's it
  const [dataInitialized, setDataInitialized] = useState([]);
  const [dataInitializedandPaid, setDataInitializedandPaid] = useState([]);
  const [dataAwaitSellerAccepts, setDataAwaitSellerAccepts] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);

  // load options using API call
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();
    const dataInitialized = await fetch(`./api/api-getPublicOffers_CreatedByBuyer_buyer_initialized` + "?UserWallet=" + connectedAddress)
      .then((res) => res.json())
      .then((json) => setDataInitialized(json));

    const dataInitializedandPaid = await fetch(`./api/api-getPublicOffers_CreatedByBuyer_buyer_initialized_and_paid` + "?UserWallet=" + connectedAddress)
      .then((res) => res.json())
      .then((json) => setDataInitializedandPaid(json));

    const dataAwaitSellerAccepts = await fetch(`./api/api-getPublicOffers_CreatedByBuyer_await_seller_accepts` + "?UserWallet=" + connectedAddress)
      .then((res) => res.json())
      .then((json) => setDataAwaitSellerAccepts(json));

    console.log(dataInitialized);
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
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Contracts Created as Buyer (not yet accepted)</h1>
        </div>


        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>Contracts that need to be funded yet</h2>
              <p>
                Need to be funded and have the personalized Sellers set
              </p>
            </div>
          </div>
          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : dataInitialized[0] && dataInitialized ? (
              <Table_normal data={dataInitialized} isFunded={false}/>
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
              <h2>Contracts that have been funded already</h2>
              <p>
                Need to have the personalized Sellers set
              </p>
            </div>
          </div>
          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : dataInitializedandPaid[0] && dataInitializedandPaid ? (
              <Table_normal data={dataInitializedandPaid} isFunded={true}/>
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
              <h2>Contracts that have been funded already and Set personalized Sellers</h2>
              <p>
                can still update the personalized Sellers set or cancel (to be implemented)
              </p>
            </div>
          </div>
          <div className="cardBody">
            {placeholder ? (
              <div className="blockLoading">
                <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
              </div>
            ) : dataAwaitSellerAccepts[0] && dataAwaitSellerAccepts ? (
              <Table_normal data={dataAwaitSellerAccepts} isFunded={true}/>
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
  const { data, isFunded } = props;

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

              { !isFunded ? (
                <StyledTableCell>Fund the contract</StyledTableCell>
              ) : (
                <></>
              )}
              
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <Row_normal key={item.id} item={item.name} isFunded={isFunded}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p id="submitFeedback" hidden></p>
    </>
  );
}

function Row_normal(props) {
  const { item, isFunded } = props;
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
          <label className="mobileLabel">Time to Deliver (hours)</label>
          {item.TimeToDeliver}
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">Valid Until</label>
          {wrapEpochToDate(item.OfferValidUntil)}
        </StyledTableCell>

        {isFunded ? (
          <>

          </>
        ) : (
          <>
            {item.CurrencyTicker == "ETH" || approvedERC20 ? (
              <>
                <StyledTableCell></StyledTableCell>
                {/* don't show approval button */}
              </>
            ) : (
              <>
                <StyledTableCell>
                  <input
                    className="button primary rounded"
                    type="submit"
                    value={"Approve " + item.CurrencyTicker}
                    onClick={() => {
                      ApproveERC20_Moralis(item.index)
                        .then(async (transactionHash) => {
                          console.log("approval for ERC20 successfully completed");
                          console.log("transactionHash: ", transactionHash);

                          // hide approve button
                          setApprovedERC20(true);

                          var formData = new FormData();
                          formData.append("userAccount", Moralis.User.current().id);

                          const connectedAddress = await GetWallet_NonMoralis();
                          formData.append("wallet", connectedAddress);
                          formData.append("transactionHash", transactionHash);
                          formData.append("objectId", item.objectId);

                          var xhr = new XMLHttpRequest();
                          xhr.open("POST", "/api/api-approvedERC20", false);
                          xhr.onload = function () {
                            // update the feedback text
                            document.getElementById("submitFeedback" ).style.display = "inline";
                            document.getElementById("submitFeedback").innerText = "granting approval...";
                            console.log("approval granted");
                          };
                          xhr.send(formData);
                        })
                        .catch((error) => {
                          console.error(error);
                          console.log("approval error code: " + error.code);
                          console.log("approval error message: " + error.message);
                          if (error.data && error.data.message) {
                            document.getElementById("submitFeedback").innerText = error.data.message;
                          } else {
                            document.getElementById("submitFeedback").innerText = error.message;
                          }
                          document.getElementById( "submitFeedback" ).style.visibility = "visible";
                          process.exitCode = 1;
                        });
                    }}
                  ></input>
                </StyledTableCell>
              </>
            )}

            <StyledTableCell>
              <input
                className="button primary rounded"
                type="submit"
                value="Fund Contract"
                onClick={() =>
                  FundContract_Moralis(item.index)
                    .then(async (transactionHash) => {
                      // show the feedback text
                      document.getElementById("submitFeedback").style.display = "inline";
                      document.getElementById("submitFeedback").innerText = "Creating offer...";

                      var formData = new FormData();
                      formData.append("SellerWallet", item.SellerWallet);                   
                      formData.append("transactionHash", transactionHash);
                      formData.append("objectId", item.objectId);

                      var xhr = new XMLHttpRequest();
                      xhr.open("POST", "/api/api-contractFunded", false);
                      xhr.onload = function () {
                        // update the feedback text
                        document.getElementById("submitFeedback").style.display = "inline";
                        document.getElementById("submitFeedback").innerText = "offer accepted";

                        // show the feedback text
                        document.getElementById("submitFeedback").style.display = "inline";
                        document.getElementById("submitFeedback").innerText = "Accepting offer...";
                        console.log("contract funded");
                      };
                      xhr.send(formData);
                    })
                    .catch((error) => {
                      console.error(error);
                      console.log("accept offer error code: " + error.code);
                      console.log("accept offer error message: " + error.message);
                      if (error.data && error.data.message) {
                        document.getElementById("submitFeedback").innerText = error.data.message;
                      } else {
                        document.getElementById("submitFeedback").innerText = error.message;
                      }
                      document.getElementById("submitFeedback").style.visibility = "visible";
                      process.exitCode = 1;
                    })
                }
              ></input>
            </StyledTableCell>
          </>
        )}


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

                {isFunded ? (<>
                  {/* show the personalized list  */}

                  {/* have a field to add to the list  */}

                  {/* have a field to remove from the list  */}

                  {/* have a submit button to update the list */}

                  <div className="listDataItem">
                    <div className="listItemLabel">Personalized List</div>
                    Current list:
                    <div className="listItemValue">{item.PersonalizedOffer}</div>

                    ADD: <input
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
                    <br></br>

                    <input
                      className="button primary rounded"
                      type="submit"
                      value="Update PersonalizedOffer"
                      onClick={() =>
                        UpdatePersonalizedOffer_Moralis(
                          item.index, 
                          true, 
                          document.getElementById("personalizedToAdd").value,
                          document.getElementById("personalizedToRemove").value
                          )
                          .then(async (transactionHash) => {
                            // show the feedback text
                            document.getElementById("submitFeedback").style.display = "inline";
                            document.getElementById("submitFeedback").innerText = "Updating Personalized...";

                            var formData = new FormData();
                            formData.append("SellerWallet", item.SellerWallet);                   
                            formData.append("transactionHash", transactionHash);
                            formData.append("isBuyer", "true");
                            formData.append("PersonalizedToAdd", document.getElementById("personalizedToAdd").value);
                            formData.append("PersonalizedToRemove", document.getElementById("personalizedToRemove").value);
                            formData.append("objectId", item.objectId);

                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", "/api/api-updatePersonalized", false);
                            xhr.onload = function () {
                              // update the feedback text
                              document.getElementById("submitFeedback").style.display = "inline";
                              document.getElementById("submitFeedback").innerText = "PersonalizedOffer updated";
                              console.log("contract funded");
                            };
                            xhr.send(formData);
                          })
                          .catch((error) => {
                            console.error(error);
                            console.log("accept offer error code: " + error.code);
                            console.log("accept offer error message: " + error.message);
                            if (error.data && error.data.message) {
                              document.getElementById("submitFeedback").innerText = error.data.message;
                            } else {
                              document.getElementById("submitFeedback").innerText = error.message;
                            }
                            document.getElementById("submitFeedback").style.visibility = "visible";
                            process.exitCode = 1;
                          })
                      }
                    ></input>


                  </div>

                </>) : (<></>)}

              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}
