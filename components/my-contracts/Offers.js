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
  const { dataContractsOffered, placeholder } = props;

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
      label: "Available",
      value: "Available",
    },
    {
      label: "Buyer Initialized",
      value: "buyer_initialized",
    },
    {
      label: "Buyer Initialized and Paid",
      value: "buyer_initialized_and_paid",
    },
    {
      label: "Await Seller Accepts",
      value: "await_seller_accepts",
    },
    {
      label: "Paid",
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
      label: "< 24 H",
      value: "Till 24H",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "< 48 H",
      value: "Till 48H",
      availability: true,
    },
    {
      name: "filterDeliveryOffers",
      label: "< 72 H",
      value: "Till 72H",
      availability: true,
    },
  ];

  const [filteredList, setFilteredList] = useState(dataContractsOffered);
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10);
  const [filterWalletAddress, setFilterWalletAddress] = useState("");
  const [filterSide, setFilterSide] = useState("");
  const [filterStates, setFilterStates] = useState("");
  const [filterDelivery, setFilterDelivery] = useState("");

  const handleChangeWalletAddress = (event) => {
    setFilterWalletAddress(event.target.value);
  };

  const applyFilters = () => {
    let updatedList = dataContractsOffered;

    // Price Filter
    const minPrice = filterMinPrice;
    const maxPrice = filterMaxPrice;
    updatedList = updatedList.filter(
      (item) => item.name.Price >= minPrice && item.name.Price <= maxPrice
    );

    // Side Filter
    if (filterSide === "Buyer") {
      updatedList = updatedList.filter(
        (orders) => orders.name.ContractStartedBy === "Buyer"
      );
    }
    if (filterSide === "Seller") {
      updatedList = updatedList.filter(
        (orders) => orders.name.ContractStartedBy === "Seller"
      );
    }

    if (filterWalletAddress !== "") {
      updatedList = updatedList.filter(
        (orders) =>
          orders.name.SellerWallet === filterWalletAddress ||
          orders.name.BuyerWallet === filterWalletAddress
      );
    }

    // States Filter
    if (filterStates === "Available") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "Available"
      );
    } else if (filterStates === "buyer_initialized") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "buyer_initialized"
      );
    } else if (filterStates === "buyer_initialized_and_paid") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "buyer_initialized_and_paid"
      );
    } else if (filterStates === "await_seller_accepts") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "await_seller_accepts"
      );
    } else if (filterStates === "paid") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "paid"
      );
    } else if (filterStates === "complete") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "complete"
      );
    } else if (filterStates === "dispute") {
      updatedList = updatedList.filter(
        (orders) => orders.name.State === "dispute"
      );
    }

    // States Filter
    if (filterDelivery === "Till 24H") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 1
      );
    } else if (filterDelivery === "Till 48H") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 2
      );
    } else if (filterDelivery === "Till 72H") {
      updatedList = updatedList.filter(
        (orders) => orders.name.TimeToDeliver <= 3
      );
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
  ]);

  return (
    <div className="containerWithSidebar">
      <FilterBar
        walletAddressFn={handleChangeWalletAddress}
        filterSide={filterSide}
        setFilterSide={setFilterSide}
        filterStates={filterStates}
        setFilterStates={setFilterStates}
        filterDelivery={filterDelivery}
        setFilterDelivery={setFilterDelivery}
        setFilterMaxPrice={setFilterMaxPrice}
        setFilterMinPrice={setFilterMinPrice}
        filterSideValues={filterSideValues}
        dropDownOptions={dropDownOptions}
        deliveryValues={deliveryValues}
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
          <Table_normal data={dataContractsOffered} />
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
              <StyledTableCell>Price (ETH)</StyledTableCell>
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
          {item.TimeToDeliver} H
        </StyledTableCell>
        <StyledTableCell>
          <label className="mobileLabel">Valid Until</label>
          {wrapEpochToDate(item.OfferValidUntil)}
        </StyledTableCell>

        <StyledTableCell>
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

        {/* OLD - org 
        <StyledTableCell>
          <input
            className="button primary rounded"
            type="submit"
            value="Accept Offer (buyer)"
            onClick={() =>
              AcceptOfferBuyer_Moralis(item.index)
                .then(async (transactionHash) => {
                  // show the feedback text
                  document.getElementById("submitFeedback").style.display =
                    "inline";
                  document.getElementById("submitFeedback").innerText =
                    "Creating offer...";

                  var formData = new FormData();
                  formData.append("SellerWallet", item.SellerWallet);   

                  const connectedAddress = await GetWallet_NonMoralis();
                  formData.append("BuyerWallet", connectedAddress);
                  formData.append("transactionHash", transactionHash);
                  formData.append("objectId", item.objectId);

                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", "/api/api-acceptedOfferByBuyer", false);
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
      */}
      </StyledTableRow>

      {/* <TableRow>
        <StyledInnerTableCell></StyledInnerTableCell>
        <StyledInnerTableCell>Seller Wallet</StyledInnerTableCell>
        <StyledInnerTableCell>{item.SellerWallet}</StyledInnerTableCell>
      </TableRow> */}

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

export default OffersContainer;
