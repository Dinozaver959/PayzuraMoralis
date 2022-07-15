import React, { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import Moralis from "moralis";
import { sha256 } from "js-sha256";
import {
  contractOnNetwork,
  ConvertNetworkNameToChainID,
  GetWallet_NonMoralis,
  clonedContractsIndex_Moralis,
  CreateEscrow_Moralis,
} from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Button from "../components/ui/Button";
import RightArrowIc from "../components/icons/RightArrow";
import LinkArrowIc from "../components/icons/LinkArrow";
import CheckIc from "../components/icons/Check";
import InfoIc from "../components/icons/Info";
import OfferTemplates from "../components/offer-creation/templates";
import DownloadIc from "../components/icons/Download";

export default function Description(props) {
  // SUBMIT - validation
  const {
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

    //console.log("date:");
    //console.log(date);

    return date;
  });

  async function SubmitForm() {
    CreateEscrow_Moralis(
      document.getElementById("Price").value,
      document.getElementById("CurrencyTicker").value, // expected values: `ETH`, `USDC`
      document.getElementById("TimeToDeliver").value,
      sha256(document.getElementById("OfferDescription").value),
      OfferValidUntil.getTime() / 1000,
      document.getElementById("PersonalizedOffer").value,
      document.getElementById("Arbiters").value
    )
      .then(async (transactionHash) => {
        // show the feedback text
        document.getElementById("submitFeedback").style.display = "inline";
        document.getElementById("submitFeedback").innerText =
          "Creating offer...";

        var form = document.querySelector("form");
        var formData = new FormData(form);
        formData.append("SellerAccount", Moralis.User.current().id);

        // read the current number of agreements to figure out what is the agreement index for this case
        const index = (await clonedContractsIndex_Moralis()) - 1;
        console.log("new index: " + index);
        formData.append("index", index);

        const connectedAddress = await GetWallet_NonMoralis();
        formData.append("SellerWallet", connectedAddress);
        formData.append(
          "hashDescription",
          sha256(document.getElementById("OfferDescription").value)
        );
        formData.append("transactionHash", transactionHash);
        formData.append("OfferValidUntil", OfferValidUntil.getTime() / 1000);

        formData.append("CurrencyTicker", CurrencyTicker);
        formData.append(
          "ChainID",
          ConvertNetworkNameToChainID(contractOnNetwork)
        );

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/api-createOffer", false);
        xhr.onload = function () {
          // do something to response
          // console.log(this.responseText);

          // update the feedback text
          document.getElementById("submitFeedback").style.display = "inline";
          document.getElementById("submitFeedback").innerText = "offer created";

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
          document.getElementById("submitFeedback").innerText =
            error.data.message;
        } else {
          document.getElementById("submitFeedback").innerText = error.message;
        }
        document.getElementById("submitFeedback").style.visibility = "visible";
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
  const [selectedTemplate, setSelectedTemplate] = React.useState("Empty");
  const [showForm, setShowForm] = React.useState(false);
  const [tempDesc, setTempDesc] = React.useState();
  const [offerValidity, setOfferValidity] = React.useState("7 Days");
  const [showDatepicker, setShowDatepicker] = React.useState(false);

  const handleRadioChange = (e) => {
    const { value } = e.target;

    const selctDesc = [];
    // if (value === "blank") {
    //   selctDesc = [
    //     {
    //       id: 99,
    //       templateCode: "Empty",
    //       templateName: "Blank Description",
    //       templateDescription: "",
    //     },
    //   ];
    // } else {
    selctDesc = TemplatesData.filter(
      (curElem) => curElem.templateCode === value
    );
    // }
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

  const offerValidityHandler = (event, selectedValidity) => {
    setOfferValidity(selectedValidity);

    if (selectedValidity === "Set Custom") {
      setShowDatepicker(!showDatepicker);
    } else {
      setShowDatepicker(false);

      let days = 365;
      if (selectedValidity === "7 Days") {
        days = 7;
      }
      if (selectedValidity === "14 Days") {
        days = 14;
      }
      if (selectedValidity === "30 Days") {
        days = 30;
      }
      if (selectedValidity === "90 days") {
        days = 90;
      }

      updateOfferValidVariable(days);
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
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Offers Creation</h1>
        </div>

        {!showForm && (
          <div className="card mt-10">
            <div className="cardHeader">
              <div className="cardTitle">
                <h2>Choose a Template</h2>
                <p>
                  This will help you to generate by default template for
                  creating offer.
                </p>
              </div>
            </div>

            <div className="cardBody">
              <div className="offerTemplateMain">
                <OfferTemplates
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
                    className={
                      selectedTemplate === item.templateCode
                        ? "offerCard selected"
                        : "offerCard"
                    }
                  >
                    <input
                      name="offerCardTemplates"
                      value={item.templateCode}
                      type="radio"
                      onChange={handleRadioChange}
                      defaultChecked={selectedTemplate === item.templateCode}
                      id={item.id}
                    />
                    <label htmlFor={item.id} className="linkBlock">
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
              <div className="offerCreationFormMain">
                <form
                  id="formToSubmit"
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="formMain formHorizontal">
                    <div className="formRow">
                      <div className="formLabel"> Contract Title</div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="ContractTitle"
                          type="text"
                          {...register("ContractTitle", {
                            required: true,
                            minLength: 4,
                            maxLength: 24,
                            pattern: /^[a-z][a-z0-9_-]*/i,
                          })}
                        ></input>

                        <div className="fieldError">
                          {errors.ContractTitle &&
                            errors.ContractTitle.type === "required" && (
                              <p>required</p>
                            )}
                          {errors.ContractTitle &&
                            errors.ContractTitle.type === "maxLength" && (
                              <p>Max length is 24 chars</p>
                            )}
                          {errors.ContractTitle &&
                            errors.ContractTitle.type === "minLength" && (
                              <p>Min length is 4 chars</p>
                            )}
                          {errors.ContractTitle &&
                            errors.ContractTitle.type === "pattern" && (
                              <p>
                                Start with an alphabet character. No spaces or
                                special characters
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Contract Description</div>
                      <div className="formField">
                        <textarea
                          cols="40"
                          rows="10"
                          className="formTextarea"
                          id="OfferDescription"
                          type="text"
                          width="200"
                          height="80"
                          {...register("OfferDescription", {
                            required: true,
                            minLength: 4,
                            maxLength: 440,
                          })}
                          value={tempDesc}
                          onChange={(e) =>
                            tempDesc + setTempDesc(e.currentTarget.value)
                          }
                        ></textarea>

                        <div className="fieldError">
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "required" && (
                              <p>required</p>
                            )}
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "maxLength" && (
                              <p>Max length is 440 chars</p>
                            )}
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "minLength" && (
                              <p>Min length is 4 chars</p>
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
                      <div className="formLabel">Currency:</div>
                      <div className="formField">
                        <select
                          className="formSelect"
                          id="CurrencyTicker"
                          {...register("CurrencyTicker", {
                            required: true,
                          })}
                        >
                          <option selected value="">
                            Please Select
                          </option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDC">USD Coin (USDC)</option>
                          {/* <option value="APE">APEcoin (APE)</option>
                          <option value="WBTC">Wrapped Bitcoin (WBTC)</option> */}
                        </select>

                        <div className="fieldError">
                          {errors.CurrencyTicker &&
                            errors.CurrencyTicker.type === "required" && (
                              <p>required</p>
                            )}
                        </div>
                      </div>
                    </div>


                    <div className="formRow">
                      <div className="formLabel">Currency (change to dropdown)</div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="CurrencyTicker"
                          type="text"
                          {...register("CurrencyTicker", {
                            required: true,
                            /*
                            minLength: 42,
                            maxLength: 42,
                            pattern: /^0x[a-fA-F0-9] * /i,
                            */
                          })}
                        ></input>
                      </div>
                    </div>


                    <div className="formRow">
                      <div className="formLabel">Price</div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="Price"
                          type="number"
                          {...register("Price", { required: true, min: 0 })}
                          min="0"
                          step="0.001"
                        ></input>
                        <div className="fieldError">
                          {errors.Price && errors.Price.type === "required" && (
                            <p>required</p>
                          )}
                          {errors.Price && errors.Price.type === "min" && (
                            <p>Min price is 0</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Contract Duration</div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="TimeToDeliver"
                          type="number"
                          {...register("TimeToDeliver", {
                            required: true,
                            min: 0,
                          })}
                          min="0"
                          step="1"
                        ></input>
                        <div className="fieldError">
                          {errors.TimeToDeliver &&
                            errors.TimeToDeliver.type === "required" && (
                              <p>required</p>
                            )}
                          {errors.TimeToDeliver &&
                            errors.TimeToDeliver.type === "min" && (
                              <span>Min contract duration time is 0</span>
                            )}
                        </div>
                      </div>
                      <div className="filedInfo">
                        <Tooltip
                          title="Following acceptance of the offer, how long does the service provider have to fulfill the agreement"
                          placement="top"
                          enterTouchDelay={0}
                          arrow
                        >
                          <i>
                            <InfoIc />
                          </i>
                        </Tooltip>
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
                    <div className="formRow offerValidity">
                      <div className="formLabel">Can Accept Until</div>
                      <div className="formField">
                        <ToggleButtonGroup
                          value={offerValidity}
                          exclusive
                          onChange={offerValidityHandler}
                          aria-label="all offerValidity"
                        >
                          <ToggleButton
                            value="7 Days"
                            aria-label="offerValidity"
                          >
                            7 Days
                          </ToggleButton>
                          <ToggleButton
                            value="14 Days"
                            aria-label="offerValidity"
                          >
                            14 Days
                          </ToggleButton>
                          <ToggleButton
                            value="30 Days"
                            aria-label="offerValidity"
                          >
                            30 Days
                          </ToggleButton>
                          <ToggleButton
                            value="90 days"
                            aria-label="offerValidity"
                          >
                            90 days
                          </ToggleButton>
                          <ToggleButton
                            value="Set Custom"
                            aria-label="offerValidity"
                          >
                            Set Custom
                          </ToggleButton>
                        </ToggleButtonGroup>

                        {showDatepicker && (
                          <div className="mt-15">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DateTimePicker
                                label="Offer Valid Until"
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                value={OfferValidUntil}
                                onChange={(newValue) => {
                                  setOfferValidUntil(newValue);
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        )}
                      </div>
                      <div className="filedInfo">
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
                    </div>

                    <div className="formRow">
                      <div className="formLabel">
                      Contract Valid for these Wallets
                      </div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="PersonalizedOffer"
                          type="text"
                          name="PersonalizedOffer"
                        ></input>
                      </div>
                      <div className="filedInfo">
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
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Arbiters</div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="Arbiters"
                          type="text"
                          name="Arbiters"
                        ></input>
                      </div>
                      <div className="filedInfo">
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

                <p id="submitFeedback" hidden></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
