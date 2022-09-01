import React, { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { sha256 } from "js-sha256";
import {
  contractOnNetwork,
  ConvertNetworkNameToChainID,
  GetWallet_NonMoralis,
  clonedContractsIndex_Moralis,
  CreateEscrow_Moralis,
  PayzuraCentealizedArbiter
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import LinkArrowIc from "../components/icons/LinkArrow";
import CheckIc from "../components/icons/Check";
import InfoIc from "../components/icons/Info";
import ContractTemplates from "../components/contract-creation/templates";
import DownloadIc from "../components/icons/Download";
import BuyerIc from "../components/icons/Buyer";
import SellerIc from "../components/icons/Seller";

import ModalUi from "../components/ui/ModalUi";

import ETHIcon from "../components/images/ETH.webp";
import USDCIcon from "../components/images/USDC.webp";
import Image from "next/image";
import DownArrowIc from "../components/icons/DownArrow";
import CurrencyList from "../components/contract-creation/currency-list";
import WalletAddressField from "../components/ui/WalletAddress-Input";
import RadioGroup from "../components/ui/RadioGroup";

export default function Description(props) {
  // SUBMIT - validation
  const {
    resetField,
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => SubmitForm();

  const [OfferValidUntil, setOfferValidUntil] = React.useState(() => {
    var date = new Date();
    date.setMilliseconds(0);
    date.setDate(date.getDate() + 7); // 7 days is default value
    return date;
  });
  const [TimeToDeliver, setTimeToDeliver] = React.useState(() => {
    return 1;
  });

  const [personalizedOfferValue, setPersonalizedOfferValue] = React.useState([]);
  const [arbitersValue, setArbitersValue] = React.useState([]);
  const [errorPersonalizedOfferValue, setErrorPersonalizedOfferValue] = React.useState(false);
  const [errorArbitersValue, setErrorArbitersValue] = React.useState(false);

  const [modelData, setModelData] = React.useState({
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

  async function SubmitForm() {
    setIsFormSubmitting(!isFormSubmitting);
    let arbiters = (arbitersValidate === 'Trusted 3rd') ? arbitersValue.join(",") : PayzuraCentealizedArbiter; // document.getElementById("Arbiters").value
    CreateEscrow_Moralis(
      (selectContractType == "buyer") ? true : false,
      (await GetWallet_NonMoralis())[0],
      document.getElementById("Price").value,
      document.getElementById("CurrencyTicker").value, // expected values: `ETH`, `USDC`
      24 * TimeToDeliver, // the value should be in hours
      sha256(document.getElementById("OfferDescription").value),
      OfferValidUntil.getTime() / 1000,
      personalizedOfferValue.join(","), // document.getElementById("PersonalizedOffer").value,
      arbiters
    )
      .then(async (transactionHash) => {
        // show the feedback text
        setModelData({
          show: true,
          type: "alert",
          status: "Pending",
          message: "Creating offer...",
        });
        setIsFormSubmitting(false);

        var form = document.querySelector("form");
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();

        // read the current number of agreements to figure out what is the agreement index for this case
        const index = (await clonedContractsIndex_Moralis()) - 1;
        console.log("new index: " + index);
        formData.append("index", index);
        formData.append("hashDescription", sha256(document.getElementById("OfferDescription").value));
        formData.append("transactionHash", transactionHash);
        formData.append("OfferValidUntil", OfferValidUntil.getTime() / 1000);
        formData.append("TimeToDeliver", TimeToDeliver);
        formData.append("CurrencyTicker", selectCurrency); //CurrencyTicker
        formData.append("ChainID", ConvertNetworkNameToChainID(contractOnNetwork));
        formData.append("PersonalizedOffer", personalizedOfferValue.join(","));
        formData.append("Arbiters", arbitersValue.join(","));

        const connectedAddress = await GetWallet_NonMoralis();

        if (selectContractType == "seller") {
          formData.append("SellerWallet", connectedAddress);
          xhr.open("POST", "/api/api-createOfferBySeller", false);
        } else {
          formData.append("BuyerWallet", connectedAddress);
          xhr.open("POST", "/api/api-createOfferByBuyer", false);
        }

        xhr.onload = function () {
          // do something to response
          // console.log(this.responseText);

          // update the feedback text
          setModelData({
            show: true,
            type: "alert",
            status: "Success",
            message: "Offer created",
            transactionHash: transactionHash,
          });
          setIsFormSubmitting(false);

          // prevent the Submit button to be clickable and functionable
          removeHover();
          document.getElementById("SubmitButton").disabled = true;

          // think about also removing the hover effect
          // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
          console.log("offer created");
        };
        xhr.send(formData);
      })
      .catch((error) => {
        console.error(error);
        console.log("create offer error code: " + error.code);
        console.log("create offer error message: " + error.message);
        if (error.data && error.data.message) {
          setModelData({
            show: true,
            type: "alert",
            status: "Error",
            message: error.data.message,
          });
          setIsFormSubmitting(false);
        } else {
          setModelData({
            show: true,
            type: "alert",
            status: "Error",
            message: error.message,
          });
          setIsFormSubmitting(false);
        }
        process.exitCode = 1;
      });
  }

  // update Submit button
  const refButton = useRef(null);
  function removeHover() {
    const b1 = refButton.current; // corresponding DOM node
    // b1.className = styles.submitButton_noHover; // overwrite the style with no hover
  }

  /* Changed by FrontEnd Developer */
  const TemplatesData = [
    {
      id: 1,
      templateCode: "Empty",
      templateName: "Blank Template",
      templateDescription: "",
    },
    {
      id: 2,
      templateCode: "TempA",
      templateName: "Template A",
      templateDescription: "Some text for template A",
    },
    {
      id: 3,
      templateCode: "TempB",
      templateName: "Template B",
      templateDescription: "Some text for template B",
    },
    {
      id: 4,
      templateCode: "TempC",
      templateName: "Template C",
      templateDescription: "Some text for template C",
    },
    {
      id: 5,
      templateCode: "TempD",
      templateName: "Template D",
      templateDescription: "Some text for template D",
    },
    {
      id: 6,
      templateCode: "TempE",
      templateName: "Template E",
      templateDescription: "Some text for template E",
    },
  ];

  const CurrenciesData = [
    {
      id: 1,
      icon: ETHIcon,
      shortName: "ETH",
      name: "Ethereum",
      availability: true,
    },
    {
      id: 2,
      icon: USDCIcon,
      shortName: "USDC",
      name: "USD Coin",
      availability: true,
    },
    {
      id: 3,
      icon: USDCIcon,
      shortName: "APE",
      name: "APEcoin",
      availability: false,
    },
    {
      id: 4,
      icon: USDCIcon,
      shortName: "WBTC",
      name: "Wrapped Bitcoin",
      availability: false,
    },
    {
      id: 5,
      icon: USDCIcon,
      shortName: "SHIB",
      name: "Shiba Inu coin",
      availability: false,
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = React.useState("Empty");
  const [showForm, setShowForm] = React.useState(false);
  const [tempDesc, setTempDesc] = React.useState();
  const [contractValidity, setContractValidity] = React.useState("1 Days");
  const [showDatepicker, setShowDatepicker] = React.useState(false);
  const [contractDuration, setContractDuration] = React.useState("1 Days");
  const [showCustomDuration, setShowCustomDuration] = React.useState(false);
  const [selectCurrency, setSelectCurrency] = React.useState("ETH");
  const [selectContractType, setSelectContractType] = React.useState("seller");
  const [arbitersValidate, setArbitersValidate] = React.useState("Centralized");

  const [isFormSubmitting, setIsFormSubmitting] = React.useState(false);

  function handleCurrencyChange(e) {
    setSelectCurrency(e.target.value);
    setModelData({ show: false });
  }

  const handleRadioChange = (e) => {
    const { value } = e.target;

    const selctDesc = [];
    selctDesc = TemplatesData.filter((curElem) => curElem.templateCode === value);
    const selDecprop = selctDesc[0].templateDescription;

    setSelectedTemplate(value);
    setTempDesc(selDecprop);
  };

  function formShowHandler() {
    setShowForm(!showForm);
  }

  function updateOfferValidVariable(days) {
    var date = new Date();
    date.setMilliseconds(0);
    date.setDate(date.getDate() + days);

    setOfferValidUntil(date);
  }

  function updateOfferDurationVariable(days) {
    setTimeToDeliver(days);
  }

  const contractValidityHandler = (event, selectedValidity) => {
    setContractValidity(selectedValidity);

    let days = 365;
    if (selectedValidity === "1 Days") {
      days = 1;
    } else if (selectedValidity === "3 Days") {
      days = 3;
    } else if (selectedValidity === "7 Days") {
      days = 7;
    } else if (selectedValidity === "14 days") {
      days = 14;
    }

    if (days == 365) {
      setShowDatepicker(true);
    } else {
      //Set Custom
      setShowDatepicker(false);
      updateOfferValidVariable(days);
    }
  };

  const contractDurationHandler = (event, selectedDuration) => {
    setContractDuration(selectedDuration);

    if (selectedDuration === "Set Custom") {
      setShowCustomDuration(!showCustomDuration);
    } else {
      setShowCustomDuration(false);

      let days = 1;
      if (selectedDuration === "1 Days") {
        days = 1;
      }
      if (selectedDuration === "3 Days") {
        days = 3;
      }
      if (selectedDuration === "7 Days") {
        days = 7;
      }
      if (selectedDuration === "14 Days") {
        days = 14;
      }

      updateOfferDurationVariable(days);
    }
  };

  const downloadDescriptionValue = () => {
    const element = document.createElement("a");
    const descriptionFile = new Blob(
      [
        "Description hash: " +
        sha256("Some text for template A testing abc") +
        "\r\n" +
        "\r\n" +
        "Description:" +
        "\r\n" +
        document.getElementById("OfferDescription").value,
      ],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(descriptionFile);
    element.download = "description.txt";
    document.body.appendChild(element);
    element.click();
  };

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
          <h1>Contract Creation</h1>
        </div>

        {!showForm && (
          <div className="card mt-10">
            <div className="cardHeader">
              <div className="cardTitle">
                <h2>Choose a Template</h2>
                <p>
                  This will help you to generate by default
                  template for creating offer.
                </p>
              </div>
            </div>

            <div className="cardBody">
              <div className="contractTemplateMain">
                <ContractTemplates
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  TemplatesData={TemplatesData}
                  radioChangeFn={handleRadioChange}
                  formShowFn={formShowHandler}
                />
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="card mt-10 cardInnerSplit">
            <div className="cardSidebar">
              <h2>Templates</h2>
              <ul>
                {TemplatesData.map((item) => (
                  <li
                    key={item.id}
                    className={selectedTemplate === item.templateCode ? "contractCard selected" : "contractCard"}
                  >
                    <input
                      name="contractCardTemplates"
                      value={item.templateCode}
                      type="radio"
                      onChange={handleRadioChange}
                      defaultChecked={selectedTemplate === item.templateCode}
                      id={item.id}
                    />
                    <label
                      htmlFor={item.id}
                      className="linkBlock"
                    >
                      <span>{item.templateName}</span>
                      <i>
                        <LinkArrowIc />
                      </i>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cardBody">
              <div className="contractCreationFormMain">
                {isFormSubmitting === true && (
                  <div className="sendingData">
                    <div className="spinnerLoading">Loading...</div>
                  </div>
                )}
                <form
                  id="formToSubmit"
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="formMain formHorizontal">
                    <div className="buyerSelerSelection">
                      <ul>
                        <li>
                          <input
                            type="radio"
                            name="contractType"
                            id="asBuyer"
                            value="buyer"
                            onClick={() => setSelectContractType("buyer")}
                          />
                          <label htmlFor="asBuyer">
                            <BuyerIc />
                            <span>As a Buyer</span>
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            name="contractType"
                            id="asSeller"
                            value="seller"
                            onClick={() => setSelectContractType("seller")}
                            defaultChecked={true}
                          />
                          <label htmlFor="asSeller">
                            <SellerIc />
                            <span>As a Seller</span>
                          </label>
                        </li>
                      </ul>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Contract Title
                      </div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="ContractTitle"
                          type="text"
                          {...register(
                            "ContractTitle",
                            {
                              required: true,
                              minLength: 4,
                              maxLength: 24,
                              pattern: /^[a-z][a-z0-9_-]*/i,
                            }
                          )}
                        ></input>

                        <div className="fieldError">
                          {errors.ContractTitle && errors.ContractTitle.type === "required" && (
                            <p>required</p>
                          )}
                          {errors.ContractTitle && errors.ContractTitle.type === "maxLength" && (
                            <p>Max length is 24 chars</p>
                          )}
                          {errors.ContractTitle && errors.ContractTitle.type === "minLength" && (
                            <p>Min length is 4 chars</p>
                          )}
                          {errors.ContractTitle && errors.ContractTitle.type === "pattern" && (
                            <p>Start with an alphabet character. No spaces or special characters</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Contract Description
                      </div>
                      <div className="formField descriptionField">
                        <textarea
                          cols="40"
                          rows="10"
                          className="formTextarea"
                          id="OfferDescription"
                          type="text"
                          width="200"
                          height="80"
                          {...register(
                            "OfferDescription",
                            {
                              required: true,
                              minLength: 4,
                              maxLength: 440,
                            }
                          )}
                          value={tempDesc}
                          onChange={(e) => tempDesc + setTempDesc(e.currentTarget.value)}
                        ></textarea>

                        <div className="fieldError">
                          {errors.OfferDescription && errors.OfferDescription.type === "required" && (
                            <p>required</p>
                          )}
                          {errors.OfferDescription && errors.OfferDescription.type === "maxLength" && (
                            <p>Max length is 440 chars</p>
                          )}
                          {errors.OfferDescription && errors.OfferDescription.type === "minLength" && (
                            <p>Min length is 4chars</p>
                          )}
                        </div>
                      </div>
                      <div className="filedInfo">
                        <Tooltip
                          title="Download Description"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <DownloadIc onClick={downloadDescriptionValue} />
                          </i>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Price
                      </div>
                      <div className="formField">
                        <div className="customPriceField">
                          <input
                            className="formInput"
                            id="Price"
                            type="number"
                            {...register("Price", {
                              required: true,
                              min: 0,
                            })}
                            min="0"
                            step="0.001"
                            placeholder="0.0"
                          ></input>

                          <button
                            type="button"
                            className="button"
                            id="CurrencyTicker"
                            value={selectCurrency}
                            {...register("CurrencyTicker", {
                              required: true,
                            })}
                            onClick={() =>
                              setModelData({
                                show: true,
                                type: "modal",
                                title: "Select Currency",
                                body: (
                                  <CurrencyList
                                    CurrenciesData={CurrenciesData}
                                    currencyChangeFn={handleCurrencyChange}
                                    defaultValue={selectCurrency}
                                  />
                                ),
                              })
                            }
                          >
                            {CurrenciesData.filter((item) => item.shortName === selectCurrency).map(
                              (selectedItem) => (
                                <Fragment key={selectedItem}>
                                  <i className="currencyIc">
                                    <Image
                                      src={selectedItem.icon}
                                      width={25}
                                      height={25}
                                      alt={selectedItem.name}
                                    />
                                  </i>
                                  <span>
                                    {selectedItem.shortName}
                                  </span>
                                  <DownArrowIc size={20} />
                                </Fragment>
                              )
                            )}
                          </button>
                        </div>
                        <div className="fieldError">
                          {errors.Price && errors.Price.type === "required" && (<p>Price required</p>)}
                          {errors.Price && errors.Price.type === "min" && (<p>Min price is 0</p>)}
                          {errors.CurrencyTicker && errors.CurrencyTicker.type === "required" && (<p>Currency required</p>)}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Contract Duration
                        <Tooltip
                          title="Following acceptance of the contract, how long does the service provider have to fulfill the agreement"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <InfoIc />
                          </i>
                        </Tooltip>
                      </div>
                      <div className="formField">
                        <ToggleButtonGroup
                          value={contractDuration}
                          exclusive
                          onChange={contractDurationHandler}
                          aria-label="all contractDuration"
                        >
                          <ToggleButton
                            value="1 Days"
                            aria-label="contractDuration"
                          >
                            1 Day
                          </ToggleButton>
                          <ToggleButton
                            value="3 Days"
                            aria-label="contractDuration"
                          >
                            3 Days
                          </ToggleButton>
                          <ToggleButton
                            value="7 Days"
                            aria-label="contractDuration"
                          >
                            7 Days
                          </ToggleButton>
                          <ToggleButton
                            value="14 Days"
                            aria-label="contractDuration"
                          >
                            14 Days
                          </ToggleButton>
                          <ToggleButton
                            value="Set Custom"
                            aria-label="contractDuration"
                          >
                            Set Custom
                          </ToggleButton>
                        </ToggleButtonGroup>
                        {showCustomDuration && (
                          <input
                            className="formInput mt-10"
                            id="TimeToDeliver"
                            type="number"
                            {...register(
                              "TimeToDeliver",
                              {
                                required: true,
                                min: 0,
                              }
                            )}
                            min="0"
                            step="1"
                          ></input>
                        )}

                        <div className="fieldError">
                          {errors.TimeToDeliver && errors.TimeToDeliver.type === "required" && (
                            <p>required</p>
                          )}
                          {errors.TimeToDeliver && errors.TimeToDeliver.type === "min" && (
                            <p>Min contract duration time is 0</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 
                    <div className={styles.gridItem}> 
                    Contract Valid for (in Hours, after publishing the offer, 0=infinity): 
                    <input className={styles.inlineField} id="OfferValidUntil" type="number" {...register('OfferValidUntil', { required: true, min : 0})} min="0" step="1" ></input> 
                    </div>
                    <div className={styles.gridItem}> 
                    {errors.OfferValidUntil && errors.OfferValidUntil.type === "required" && <span>required</span> }
                    {errors.OfferValidUntil && errors.OfferValidUntil.type === "min" && <span>Min time for a valid offer is 0</span>}
                    </div>
                    */}
                    <div className="formRow contractValidity">
                      <div className="formLabel">
                        Time to Accept Contract
                        <Tooltip
                          title="How long will the agreement remain available to potential buyers"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <InfoIc />
                          </i>
                        </Tooltip>
                      </div>
                      <div className="formField">
                        <ToggleButtonGroup
                          value={contractValidity}
                          exclusive
                          onChange={contractValidityHandler}
                          aria-label="all contractValidity"
                        >
                          <ToggleButton
                            value="1 Days"
                            aria-label="contractValidity"
                          >
                            1 Day
                          </ToggleButton>
                          <ToggleButton
                            value="3 Days"
                            aria-label="contractValidity"
                          >
                            3 Days
                          </ToggleButton>
                          <ToggleButton
                            value="7 Days"
                            aria-label="contractValidity"
                          >
                            7 Days
                          </ToggleButton>
                          <ToggleButton
                            value="14 days"
                            aria-label="contractValidity"
                          >
                            14 days
                          </ToggleButton>
                          <ToggleButton
                            value={TimeToDeliver} /*Set Custom*/
                            onChange={(newValue) => { setTimeToDeliver(newValue); }}
                            aria-label="contractValidity"
                          >
                            Set Custom
                          </ToggleButton>
                        </ToggleButtonGroup>

                        {showDatepicker && (
                          <div className="mt-15">
                            <LocalizationProvider
                              dateAdapter={AdapterDateFns}
                            >
                              <DateTimePicker
                                label="Contract Valid Until"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                  />
                                )}
                                value={OfferValidUntil}
                                onChange={(newValue) => { setOfferValidUntil(newValue) }}
                              />
                            </LocalizationProvider>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Contract valid for these wallets
                        <Tooltip
                          title="Wallets that will be able to see this contract and potentially accept it. Empty = Any wallet"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <InfoIc />
                          </i>
                        </Tooltip>
                      </div>
                      <div className="formField">
                        <WalletAddressField name="PersonalizedOffer"
                          inputValue={personalizedOfferValue}
                          setInputValue={setPersonalizedOfferValue}
                          errorValue={errorPersonalizedOfferValue}
                          setErrorValue={setErrorPersonalizedOfferValue}
                          register={register}
                          resetField={resetField}
                        />

                        <div className='fieldError'>
                          {errorPersonalizedOfferValue && (
                            <p>Invalid Wallet Address.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                        Arbiters
                        <Tooltip
                          title="State wallets that wil act as arbiters in case of a dispute. Empty = Payzura Platform"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <InfoIc />
                          </i>
                        </Tooltip>
                      </div>
                      <div className="formField">
                      <RadioGroup
                          selectedRadio={arbitersValidate}
                          setSelectedRadio={setArbitersValidate}
                          values={
                            [
                              {
                                name: "arbitersValidate",
                                label: "Decentralized",
                                value: "Decentralized",
                                availability: false,
                                tooltip: "Coming soon",
                              },
                              {
                                name: "arbitersValidate",
                                label: "Centralized",
                                value: "Centralized",
                                availability: true,
                              },
                              {
                                name: "arbitersValidate",
                                label: "Trusted 3rd",
                                value: "Trusted 3rd",
                                availability: true,
                              }
                            ]
                          }
                        />

                        {arbitersValidate == 'Trusted 3rd' && (
                          <div className="mt-10">
                            <WalletAddressField name="Arbiters"
                              inputValue={arbitersValue}
                              setInputValue={setArbitersValue}
                              errorValue={errorArbitersValue}
                              setErrorValue={setErrorArbitersValue}
                              isRequire={true}
                              register={register}
                              resetField={resetField}
                            />
                          </div>
                        )}

                        <div className='fieldError'>
                        {errors.Arbiters && errors.Arbiters.type === "required" && (
                            <p>Please enter at least one wallet.</p>
                          )}
                          {errors.Arbiters && errors.Arbiters.type === "pattern" && (
                            <p>Invalid Wallet Address.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/*
                    <div className={styles.gridItem}> Offer valid for these wallets (empty=any):  </div>
                    <input className={styles.gridItem} id="PersonalizedOffer" type="text" {...register('PersonalizedOffer', { pattern: /^[a-z0-9,] /i })} ></input>
                    <div className={styles.gridItem}> 
                        {errors.PersonalizedOffer && errors.PersonalizedOffer.type === "pattern" && <span><p>Comma separated wallet addresses</p></span> }
                    </div>
                    */}

                    <div className="formAction">
                      <button
                        id="SubmitButton"
                        className="button withIcon secondary"
                        type="submit"
                        // value="Submit"
                        ref={refButton}
                      >
                        <i>
                          <CheckIc />
                        </i>
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </form>

                <ModalUi
                  content={modelData}
                  closeModelFn={closeModelDataHandler}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
