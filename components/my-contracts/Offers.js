import React, { useState, useEffect } from "react";
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
  AcceptOfferBuyer_Moralis,
  ApproveERC20_Moralis,
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
const StyledInnerTableCell = styled(TableCell)({
  fontFamily: "inherit",
});

function OffersContainer(props) {
  const { dataContractsOffered, placeholder, currentAccount, isFiltersOpen, toggleFiltersFn } = props;

  const currencyOptionsValues = [
    {
      name: "currencyOptionsOffers",
      label: "ETH",
      value: "eth",
      availability: true,
    },
    {
      name: "currencyOptionsOffers",
      label: "USDC",
      value: "usdc",
      availability: true,
    },
    {
      name: "currencyOptionsOffers",
      label: "All",
      value: "All",
      availability: true,
    },
  ];

  const filterSideValues = [
    {
      name: "filterSideOffers",
      label: "Buyer",
      value: "Buyer",
      availability: true,
    },
    {
      name: "filterSideOffers",
      label: "Seller",
      value: "Seller",
      availability: true,
    },
    {
      name: "filterSideOffers",
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
      name: "filterDeliveryOffers",
      label: "1 Day",
      value: "1 Day",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "3 Days",
      value: "3 Days",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "7 Days",
      value: "7 Days",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "14 Days",
      value: "14 Days",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "All",
      value: "All",
      availability: true,
    },
  ];

  const allDataPrice = dataContractsOffered.map((data) => data.name.Price);
  const uniqueDataPrice = [...new Set(allDataPrice)];
  const numberArray = uniqueDataPrice.map(Number);

  const priceFilterMinValue = Math.min(...numberArray);
  const priceFilterMaxValue = Math.max(...numberArray);

  const [filteredList, setFilteredList] = useState(dataContractsOffered);
  const [selectCurrency, setSelectCurrency] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10);
  const [filterWalletAddress, setFilterWalletAddress] = useState("");
  const [filterSide, setFilterSide] = useState("All");
  const [filterStates, setFilterStates] = useState("All");
  const [filterDelivery, setFilterDelivery] = useState("All");

  const handleChangeWalletAddress = (event) => {
    setFilterWalletAddress(event.target.value);
  };

  const applyFilters = () => {
    let updatedList = dataContractsOffered;

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
    updatedList = updatedList.filter(
      (orders) => orders.name.PersonalizedOffer === checkAddress //|| orders.name.SellerWallet === checkAddress
    );
    if (filterWalletAddress !== "" && filterWalletAddress !== undefined) {
      checkAddress = filterWalletAddress.toLowerCase();

      updatedList = updatedList.filter(
        (orders) =>
          orders.name.SellerWallet === checkAddress ||
          orders.name.BuyerWallet === checkAddress ||
          orders.name.Arbiters === checkAddress
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
    dataContractsOffered,
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
          filterSideAvailability: false,
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
        setFilterMinPrice={setFilterMinPrice}
        selectCurrency={selectCurrency}
        setSelectCurrency={setSelectCurrency}
        currencyOptionsValues={currencyOptionsValues}
        isFiltersOpen={isFiltersOpen}
        toggleFiltersFn={toggleFiltersFn}
      />

      <div className="filtersContainer">
        <div className="containerHeader">
          <div className="totalData">{filteredList.length} total Offers</div>
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
          <label className="mobileLabel">Price (ETH)</label>
          <div className="flex-center">
            {item.Price}
            <i className="currencyIc ml-10 mr-5">
              <Image
                src={tickerToIcon(item.CurrencyTicker)}
                width={20}
                height={20}
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
          <input
            className="button primary rounded small" // button primary rounded small
            type="submit"
            value="Accept Offer"
            onClick={async () =>
              AcceptOfferBuyer_Moralis(
                item.index,
                item.CurrencyTicker,
                (await GetWallet_NonMoralis())[0]
              )
                .then(async (transactionHash) => {
                  // show the feedback text
                  setModelData({
                    show: true,
                    type: "alert",
                    status: "Pending",
                    message: "Accepting offer...",
                  });

                  var formData = new FormData();
                  formData.append("SellerWallet", item.SellerWallet);
                  formData.append("PersonalizedOffer", "true");

                  const connectedAddress = await GetWallet_NonMoralis();
                  formData.append("BuyerWallet", connectedAddress);
                  formData.append("transactionHash", transactionHash);
                  formData.append("objectId", item.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/api-acceptedOfferByBuyer", false);
                  xhr.onload = function () {
                    // show the feedback text
                    setModelData({
                      show: true,
                      type: "alert",
                      status: "Success",
                      message: "offer accepted",
                      transactionHash: transactionHash,
                    });

                    console.log("offer created");
                  };
                  xhr.send(formData);
                })
                .catch((error) => {
                  console.error(error);
                  console.log("accept offer error code: " + error.code);
                  console.log("accept offer error message: " + error.message);
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
          colSpan={6}
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

export default OffersContainer;
