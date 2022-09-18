import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { useForm } from "react-hook-form";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

import {
  GetWallet_NonMoralis,
  ReturnPayment_Moralis,
  ClaimFunds_Moralis,
  StartDispute_Moralis,
  ConfirmDelivery_Moralis,
  CancelBuyerContract_Moralis,
  CancelSellerContract_Moralis,
  UpdatePersonalizedOffer_Moralis,
} from "./../../JS/local_web3_Moralis";

import PlaceholderIc from "../icons/Placeholder";
import PlusIc from "../icons/Plus";
import Button from "../ui/Button";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import ModalUi from "../ui/ModalUi";

import Image from "next/image";
import ETHIcon from "./../images/ETH.webp";
import USDCIcon from "./../images/USDC.webp";

import FilterBar from "./FilterBar";
import WalletAddressField from "../ui/WalletAddress-Input";
import EditIc from "../icons/Edit";

const StyledTableRow = styled(TableRow)({
  fontFamily: "inherit",
});
const StyledTableCell = styled(TableCell)({
  fontFamily: "inherit",
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

function MyContractsContainer(props) {
  const { dataGetMyContracts, placeholder, currentAccount, isFiltersOpen, toggleFiltersFn } = props;

  const currencyOptionsValues = [
    {
      name: "currencyOptions",
      label: "ETH",
      value: "eth",
      availability: true,
    },
    {
      name: "currencyOptions",
      label: "USDC",
      value: "usdc",
      availability: true,
    },
    {
      name: "currencyOptions",
      label: "All",
      value: "All",
      availability: true,
    },
  ];

  const filterSideValues = [
    {
      name: "filterSideAll",
      label: "Buyer",
      value: "Buyer",
      availability: true,
    },
    {
      name: "filterSideAll",
      label: "Seller",
      value: "Seller",
      availability: true,
    },
    {
      name: "filterSideAll",
      label: "All",
      value: "All",
      availability: true,
    },
  ];

  const dropDownOptions = [
    {
      label: "All",
      value: "",
    },
    {
      label: "Available To Buyers",
      value: "Available",
    },
    {
      label: "Specifying Qualified Sellers",
      value: "buyer_initialized_and_paid",
    },
    {
      label: "Available To Sellers",
      value: "await_seller_accepts",
    },
    {
      label: "In Progress",
      value: "paid",
    },
    {
      label: "Complete",
      value: "complete",
    },
    {
      label: "Dispute",
      value: "dispute",
    },
  ];

  const deliveryValues = [
    {
      name: "filterDeliveryAll",
      label: "1 Day",
      value: "1 Day",
      availability: true,
    },
    {
      name: "filterDeliveryAll",
      label: "3 Days",
      value: "3 Days",
      availability: true,
    },
    {
      name: "filterDeliveryAll",
      label: "7 Days",
      value: "7 Days",
      availability: true,
    },
    {
      name: "filterDeliveryAll",
      label: "14 Days",
      value: "14 Days",
      availability: true,
    },
    {
      name: "filterDeliveryAll",
      label: "All",
      value: "All",
      availability: true,
    },
  ];

  const allDataPrice = dataGetMyContracts.map((data) => data.name.Price);
  const uniqueDataPrice = [...new Set(allDataPrice)];
  const numberArray = uniqueDataPrice.map(Number);

  const priceFilterMinValue = Math.min(...numberArray);
  const priceFilterMaxValue = Math.max(...numberArray);

  const [filteredList, setFilteredList] = useState(dataGetMyContracts);
  const [selectCurrency, setSelectCurrency] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10);
  const [filterWalletAddress, setFilterWalletAddress] = useState();
  const [filterSide, setFilterSide] = useState("All");
  const [filterStates, setFilterStates] = useState("All");
  const [filterDelivery, setFilterDelivery] = useState("All");

  const handleChangeWalletAddress = (event) => {
    setFilterWalletAddress(event.target.value);
  };

  const applyFilters = () => {
    let updatedList = dataGetMyContracts;

    // Currency Selection Filter
    if (selectCurrency === "eth") {
      updatedList = updatedList.filter(
        (orders) => orders.name.CurrencyTicker === "ETH"
      );
    } else if (selectCurrency === "usdc") {
      updatedList = updatedList.filter(
        (orders) => orders.name.CurrencyTicker === "USDC"
      );
    } else if (selectCurrency === "All") {
      updatedList = updatedList.filter(
        (orders) =>
          orders.name.CurrencyTicker === "ETH" ||
          orders.name.CurrencyTicker === "USDC"
      );
    }

    // Price Filter
    const minPrice = filterMinPrice;
    const maxPrice = filterMaxPrice;
    updatedList = updatedList.filter(
      (item) => item.name.Price >= minPrice && item.name.Price <= maxPrice
    );

    // Wallet Address Filter
    let checkAddress = currentAccount.toLowerCase();
    if (filterWalletAddress !== "" && filterWalletAddress !== undefined) {
      checkAddress = filterWalletAddress.toLowerCase();
    }
    if (filterSide === "All") {
      updatedList = updatedList.filter(
        (orders) =>
          orders.name.SellerWallet === checkAddress ||
          orders.name.BuyerWallet === checkAddress
      );
    } else if (filterSide === "Buyer") {
      updatedList = updatedList.filter(
        (orders) => orders.name.BuyerWallet === checkAddress
      );
    } else if (filterSide === "Seller") {
      updatedList = updatedList.filter(
        (orders) => orders.name.SellerWallet === checkAddress
      );
    }

    // States Filter
    if (filterStates === "Available To Buyers") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "Available"
      );
    } else if (filterStates === "Specifying Qualified Sellers") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "buyer_initialized_and_paid"
      );
    } else if (filterStates === "Available To Sellers") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "await_seller_accepts"
      );
    } else if (filterStates === "In Progress") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "paid"
      );
    } else if (filterStates === "Complete") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "complete"
      );
    } else if (filterStates === "Dispute") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "dispute"
      );
    }

    // Duration Filter
    if (filterDelivery === "1 Day") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 1
      );
    } else if (filterDelivery === "3 Days") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 3
      );
    } else if (filterDelivery === "7 Days") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 7
      );
    } else if (filterDelivery === "14 Days") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 14
      );
    } else if (filterDelivery === "All") {
      updatedList = updatedList.filter((orders) => orders.name.TimeToDeliver);
    }

    setFilteredList(updatedList);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataGetMyContracts,
    filterWalletAddress,
    filterSide,
    filterStates,
    filterMinPrice,
    filterMaxPrice,
    filterDelivery,
    selectCurrency,
  ]);

  return (
    <div className="containerWithSidebar">
      <FilterBar
        walletAddressFn={handleChangeWalletAddress}
        params={{
          priceFilterMinValue: priceFilterMinValue,
          priceFilterMaxValue: priceFilterMaxValue,
        }}
        filterSide={filterSide}
        setFilterSide={setFilterSide}
        filterSideValues={filterSideValues}
        filterStates={filterStates}
        setFilterStates={setFilterStates}
        dropDownOptions={dropDownOptions}
        filterDelivery={filterDelivery}
        setFilterDelivery={setFilterDelivery}
        deliveryValues={deliveryValues}
        setFilterMaxPrice={setFilterMaxPrice}
        filterMinPrice={filterMinPrice}
        setFilterMinPrice={setFilterMinPrice}
        selectCurrency={selectCurrency}
        setSelectCurrency={setSelectCurrency}
        currencyOptionsValues={currencyOptionsValues}
        isFiltersOpen={isFiltersOpen}
        toggleFiltersFn={toggleFiltersFn}
      />

      <div className="filtersContainer">
        <div className="containerHeader">
          <div className="totalData">{filteredList.length} total contracts</div>
        </div>
        {placeholder ? (
          <div className="blockLoading">
            <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
          </div>
        ) : filteredList[0] && filteredList ? (
          <Table_normal data={filteredList} currentAccount={currentAccount} />
        ) : (
          <div className="noData mt-20">
            <i>
              <PlaceholderIc />
            </i>
            <h2>There are no available contracts.</h2>
            <div className="submitButtonOuter">
              <Button
                link="/create-contract"
                classes={"button secondary withIcon rounded"}
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
  );
}

function Table_normal(props) {
  const { data, currentAccount } = props;

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
              <StyledTableCell>Time to Deliver</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <Row_normal
                key={item.id}
                item={item.name}
                isBuyer={
                  (item.name.ContractStartedBy === "Buyer" &&
                    item.name.BuyerWallet === currentAccount.toLowerCase()) ||
                  (item.name.ContractStartedBy === "Seller" &&
                    item.name.SellerWallet !== currentAccount.toLowerCase())
                }
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
              {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </IconContext.Provider>
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          <label className="mobileLabel">Title</label>
          {item.ContractTitle}
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">State</label>
          {/* {item.State} */}
          {item.State === "Available" && (
            <div className="statusChip statusAvailableBuyers">
              Available To Buyers
            </div>
          )}
          {item.State === "buyer_initialized_and_paid" && (
            <div className="statusChip statusQualifiedSellers">
              Specifying Qualified Sellers
            </div>
          )}
          {item.State === "await_seller_accepts" && (
            <div className="statusChip statusAvailableSellers">
              Available To Sellers
            </div>
          )}
          {item.State === "paid" && (
            <div className="statusChip statusInProgress">In Progress</div>
          )}
          {item.State === "canceled" && (
            <div className="statusChip statusCanceled">Canceled</div>
          )}
          {item.State === "complete" && (
            <div className="statusChip statusComplete">Complete</div>
          )}
          {item.State === "dispute" && (
            <div className="statusChip statusDispute">Dispute</div>
          )}
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
          <label className="mobileLabel">Time to Deliver</label>
          {item.TimeToDeliver} Day(s)
        </StyledTableCell>

        {item.State == "complete" ||
        item.State == "canceled" ||
        item.State == "dispute" ? (
          <>{/* NO BUTTONS */}</>
        ) : (
          <>
            {isBuyer ? (
              item.State == "await_payment" ||
              item.State == "buyer_initialized_and_paid" ||
              item.State == "await_seller_accepts" ||
              item.State == "Available" ? (
                // show a cancel button (RED COLOR)
                <>
                  <StyledTableCell className="actionCol">
                    <input
                      className="rounded button orange small"
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
                            const connectedAddress =
                              await GetWallet_NonMoralis();
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
                            console.log(
                              "accept Offer error code: " + error.code
                            );
                            console.log(
                              "accept Offer error message: " + error.message
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
                </>
              ) : (
                <>
                  <StyledTableCell className="actionCol">
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
                            const connectedAddress =
                              await GetWallet_NonMoralis();
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
                            console.log(
                              "accept Offer error code: " + error.code
                            );
                            console.log(
                              "accept Offer error message: " + error.message
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
                            const connectedAddress =
                              await GetWallet_NonMoralis();
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
                            console.log(
                              "accept Offer error code: " + error.code
                            );
                            console.log(
                              "accept Offer error message: " + error.message
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
                </>
              )
            ) : item.State == "await_payment" ||
              item.State == "buyer_initialized_and_paid" ||
              item.State == "await_seller_accepts" ||
              item.State == "Available" ? (
              // show a cancel button (RED COLOR)
              <>
                <StyledTableCell className="actionCol">
                  <input
                    className="rounded button orange small"
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
                          console.log(
                            "accept Offer error message: " + error.message
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
              </>
            ) : (
              <>
                <StyledTableCell className="actionCol">
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
                          console.log(
                            "accept Offer error message: " + error.message
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
                    className="button rounded green small"
                    type="submit"
                    value="Claim Funds"
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
                          console.log(
                            "accept Offer error message: " + error.message
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
              </>
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
                {item.SellerWallet && (
                  <div className="listDataItem">
                    <div className="listItemLabel">Seller Wallet</div>
                    <div className="listItemValue">{item.SellerWallet}</div>
                  </div>
                )}
                {item.BuyerWallet && (
                  <div className="listDataItem">
                    <div className="listItemLabel">Buyer Wallet</div>
                    <div className="listItemValue">{item.BuyerWallet}</div>
                  </div>
                )}
                <div className="listDataItem">
                  <div className="listItemLabel">Arbiters</div>
                  <div className="listItemValue">
                    {wrapArbiters(item.Arbiters)}
                  </div>
                </div>
                <div className="listDataItem">
                  <div className="listItemLabel">Wallets Allowed to Accept</div>
                  {/* <div className="listItemValue">
                    {wrapArbiters(item.PersonalizedOffer)}
                  </div> */}
                  <div className="listItemValue">
                    {isWalletsEditable === false ? (
                      <>
                        {item.PersonalizedOffer === "" ? (
                          <div className="listOfWallets">Payzura Platform</div>
                        ) : (
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
                        )}
                      </>
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
                          className="button primary rounded small mt-15"
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
                                  "/pages/api/api-updatePersonalized",
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
                <div className="listDataItem">
                  <div className="listItemLabel">Description</div>
                  <div className="listItemValue">{item.OfferDescription}</div>
                </div>
                {/* <div className="listDataItem">
                  {wrapDelegates(item.BuyerDelegates)}
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
                      )
                        .then(async (transactionHash) => {
                          setModelData({
                            show: true,
                            type: "alert",
                            status: "Pending",
                            message: "Updating Delegates...",
                          });

                          var formData = new FormData();

                          const connectedAddress = await GetWallet_NonMoralis();
                          formData.append("BuyerWallet", connectedAddress);
                          formData.append("objectId", item.objectId);
                          formData.append("areForBuyer", "true");
                          formData.append(
                            "DelegatesToAdd",
                            "______________________"
                          );
                          formData.append(
                            "DelegatesToRemove",
                            "______________________"
                          );

                          var xhr = new XMLHttpRequest();
                          xhr.open("POST", "/api/api-updateDelegates", false);
                          xhr.onload = function () {
                            setModelData({
                              show: true,
                              type: "alert",
                              status: "Success",
                              message: "Delegates updated",
                              transactionHash: transactionHash,
                            });
                            console.log("Delegates updated");
                          };
                          xhr.send(formData);
                        })
                        .catch((error) => {
                          console.error(error);
                          console.log(
                            "update Delegates error code: " + error.code
                          );
                          console.log(
                            "update Delegates error message: " + error.message
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

                  {wrapDelegates(item.SellerDelegates)}
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
                      )
                        .then(async (transactionHash) => {
                          setModelData({
                            show: true,
                            type: "alert",
                            status: "Pending",
                            message: "Updating Delegates...",
                          });

                          var formData = new FormData();

                          const connectedAddress = await GetWallet_NonMoralis();
                          formData.append("BuyerWallet", connectedAddress);
                          formData.append("objectId", item.objectId);
                          formData.append("areForBuyer", "false");
                          formData.append(
                            "DelegatesToAdd",
                            "______________________"
                          );
                          formData.append(
                            "DelegatesToRemove",
                            "______________________"
                          );

                          var xhr = new XMLHttpRequest();
                          xhr.open("POST", "/api/api-updateDelegates", false);
                          xhr.onload = function () {
                            setModelData({
                              show: true,
                              type: "alert",
                              status: "Success",
                              message: "Delegates updated",
                              transactionHash: transactionHash,
                            });
                            console.log("Delegates updated");
                          };
                          xhr.send(formData);
                        })
                        .catch((error) => {
                          console.error(error);
                          console.log(
                            "update Delegates error code: " + error.code
                          );
                          console.log(
                            "update Delegates error message: " + error.message
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
                </div> */}
              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

export default MyContractsContainer;
