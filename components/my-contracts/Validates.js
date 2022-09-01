import React, { Fragment, useEffect, useState } from "react";
import { IconContext } from "react-icons";

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
  HandleDispute_Moralis,
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

const StyledTableRow = styled(TableRow)({
  fontFamily: "inherit",
});
const StyledTableCell = styled(TableCell)({
  fontFamily: "inherit",
});

function ValidatesContainer(props) {
  const { dataContractsToValidate, placeholder, currentAccount, isFiltersOpen, toggleFiltersFn } = props;

  const currencyOptionsValues = [
    {
      name: "currencyOptionsValidates",
      label: "ETH",
      value: "eth",
      availability: true,
    },
    {
      name: "currencyOptionsValidates",
      label: "USDC",
      value: "usdc",
      availability: true,
    },
    {
      name: "currencyOptionsValidates",
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

  const allDataPrice = dataContractsToValidate.map((data) => data.name.Price);
  const uniqueDataPrice = [...new Set(allDataPrice)];
  const numberArray = uniqueDataPrice.map(Number);

  const priceFilterMinValue = Math.min(...numberArray);
  const priceFilterMaxValue = Math.max(...numberArray);

  const [filteredList, setFilteredList] = useState(dataContractsToValidate);
  const [selectCurrency, setSelectCurrency] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10);
  const [filterWalletAddress, setFilterWalletAddress] = useState("");
  const [filterStates, setFilterStates] = useState("All");

  const handleChangeWalletAddress = (event) => {
    setFilterWalletAddress(event.target.value);
  };

  const applyFilters = () => {
    let updatedList = dataContractsToValidate;

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
    updatedList = updatedList.filter(
      (orders) => orders.name.Arbiters === checkAddress || orders.name.SellerWallet === checkAddress || orders.name.BuyerWallet === checkAddress
    );

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

    setFilteredList(updatedList);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataContractsToValidate,
    filterWalletAddress,
    filterStates,
    filterMinPrice,
    filterMaxPrice,
    selectCurrency,
  ]);

  return (
    <div className="containerWithSidebar">
      <FilterBar
        walletAddressFn={handleChangeWalletAddress}
        params={{
          filterSideAvailability: false,
          filterDurationAvailability: false,
          priceFilterMinValue: priceFilterMinValue,
          priceFilterMaxValue: priceFilterMaxValue,
        }}
        filterStates={filterStates}
        setFilterStates={setFilterStates}
        dropDownOptions={dropDownOptions}
        setFilterMaxPrice={setFilterMaxPrice}
        setFilterMinPrice={setFilterMinPrice}
        selectCurrency={selectCurrency}
        setSelectCurrency={setSelectCurrency}
        currencyOptionsValues={currencyOptionsValues}
        isFiltersOpen={isFiltersOpen}
        toggleFiltersFn={toggleFiltersFn}
      />

      <div className="filtersContainer">
        <div className="containerHeader">
          <div className="totalData">{filteredList.length} total Validates</div>
        </div>

        {placeholder ? (
          <div className="blockLoading">
            <LoadingPlaceholder extraStyles={{ position: "absolute" }} />
          </div>
        ) : filteredList[0] && filteredList ? (
          <Table_normal data={filteredList} />
        ) : (
          <div className="noData mt-20">
            <i>
              <PlaceholderIc />
            </i>
            <h2>There are no Vote on Disputes.</h2>
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

function tickerToIcon(ticker) {
  if (ticker == "USDC") {
    return USDCIcon;
  } else if (ticker == "ETH") {
    return ETHIcon;
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
              <StyledTableCell>State</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Time to Deliver</StyledTableCell>
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

        <StyledTableCell className="actionCol">
          {item.State === "dispute" && (
            <Fragment>
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
                      console.log("accept offer error code: " + error.code);
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
                      console.log("accept offer error code: " + error.code);
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
            </Fragment>
          )}
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
                  <div className="listItemValue">
                    {wrapPersonalized(item.PersonalizedOffer)}
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

export default ValidatesContainer;
