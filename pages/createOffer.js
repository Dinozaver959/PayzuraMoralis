import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import Moralis from "moralis";
import { sha256 } from "js-sha256";
import {
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
import PlusIc from "./../components/icons/Plus";
import LinkArrowIc from "./../components/icons/LinkArrow";
import CheckIc from "./../components/icons/Check";
import InfoIc from "./../components/icons/Info";

export default function Description(props) {
  // SUBMIT - validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const onSubmit = (data) => SubmitForm(); // console.log(data);
  const [OfferValidUntil, setOfferValidUntil] = React.useState(new Date());

  const [currentRadioValue, setCurrentValue] = React.useState("on");
  const handleRadioChange = (value) => {
    setCurrentValue(value);
    console.log(setCurrentValue);
  };

  async function SubmitForm() {
    // call Smart Contract function
    CreateEscrow_Moralis(
      10 ** 18 * document.getElementById("Price").value,
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
    b1.className = styles.submitButton_noHover; // overwrite the style with no hover
  }

  const [showForm, setShowForm] = React.useState("false");
  function formShowHandler() {
    setShowForm(!showForm);
  }

  const [offerValidity, setOfferValidity] = React.useState("7 Days");
  const [showDatepicker, setShowDatepicker] = React.useState(false);

  const offerValidityHandler = (event, selectedValidity) => {
    setOfferValidity(selectedValidity);

    if (selectedValidity === "Set Custom") {
      setShowDatepicker(!showDatepicker);
    }

    if (
      selectedValidity === "7 Days" ||
      selectedValidity === "14 Days" ||
      selectedValidity === "30 Days" ||
      selectedValidity === "No Expiry"
    )
      setShowDatepicker(false);
  };

  return (
    <>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Offers Creation</h1>
        </div>

        {showForm && (
          <div className="card mt-10">
            <div className="cardHeader">
              <div className="cardTitle">
                <h2>Choose a Template</h2>
                <p>
                  This will help you to generate by default template for
                  creating offer.
                </p>
              </div>

              <div className="cardAction">
                <Button
                  classes="button secondary rounded withIcon"
                  onClick={formShowHandler}
                >
                  <span>Continue</span>
                  <i>
                    <RightArrowIc />
                  </i>
                </Button>
              </div>
            </div>

            <div className="cardBody">
              <div className="offerTemplateMain">
                <div
                  className={
                    currentRadioValue === "blank"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="blank"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "blank"}
                    id="blankTemplate"
                  />
                  <label htmlFor="blankTemplate">
                    <div className="offerCardBody">
                      <div className="blankCard">
                        <i>
                          <PlusIc />
                        </i>
                        <div className="cardLabel">Use Blank Description</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div
                  className={
                    currentRadioValue === "tempA"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="tempA"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "tempA"}
                    id="templateA"
                  />
                  <label htmlFor="templateA">
                    <div className="offerCardHeader">Template A</div>
                    <div className="offerCardBody">
                      <div className="offerBodyRow">
                        <div className="labelData">Description</div>
                        <div className="valueData">
                          Some text for template A
                        </div>
                      </div>
                    </div>
                    <div className="offerCardFooter">
                      <div
                        className={
                          currentRadioValue === "tempA"
                            ? "button rounded primary"
                            : "button rounded secondary"
                        }
                      >
                        {currentRadioValue === "tempA"
                          ? "Selected"
                          : "Select Template"}
                      </div>
                    </div>
                  </label>
                </div>

                <div
                  className={
                    currentRadioValue === "tempB"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="tempB"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "tempB"}
                    id="templateB"
                  />
                  <label htmlFor="templateB">
                    <div className="offerCardHeader">Template B</div>
                    <div className="offerCardBody">
                      <div className="offerBodyRow">
                        <div className="labelData">Description</div>
                        <div className="valueData">
                          Some text for template B
                        </div>
                      </div>
                    </div>
                    <div className="offerCardFooter">
                      <div
                        className={
                          currentRadioValue === "tempB"
                            ? "button rounded primary"
                            : "button rounded secondary"
                        }
                      >
                        {currentRadioValue === "tempB"
                          ? "Selected"
                          : "Select Template"}
                      </div>
                    </div>
                  </label>
                </div>

                <div
                  className={
                    currentRadioValue === "tempC"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="tempC"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "tempC"}
                    id="templateC"
                  />
                  <label htmlFor="templateC">
                    <div className="offerCardHeader">Template C</div>
                    <div className="offerCardBody">
                      <div className="offerBodyRow">
                        <div className="labelData">Description</div>
                        <div className="valueData">
                          Some text for template C
                        </div>
                      </div>
                    </div>
                    <div className="offerCardFooter">
                      <div
                        className={
                          currentRadioValue === "tempC"
                            ? "button rounded primary"
                            : "button rounded secondary"
                        }
                      >
                        {currentRadioValue === "tempC"
                          ? "Selected"
                          : "Select Template"}
                      </div>
                    </div>
                  </label>
                </div>

                <div
                  className={
                    currentRadioValue === "tempD"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="tempD"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "tempD"}
                    id="templateD"
                  />
                  <label htmlFor="templateD">
                    <div className="offerCardHeader">Template D</div>
                    <div className="offerCardBody">
                      <div className="offerBodyRow">
                        <div className="labelData">Description</div>
                        <div className="valueData">
                          Some text for template D
                        </div>
                      </div>
                    </div>
                    <div className="offerCardFooter">
                      <div
                        className={
                          currentRadioValue === "tempD"
                            ? "button rounded primary"
                            : "button rounded secondary"
                        }
                      >
                        {currentRadioValue === "tempD"
                          ? "Selected"
                          : "Select Template"}
                      </div>
                    </div>
                  </label>
                </div>

                <div
                  className={
                    currentRadioValue === "tempE"
                      ? "offerCard selected"
                      : "offerCard"
                  }
                >
                  <input
                    name="offerCardTemplates"
                    value="tempE"
                    type="radio"
                    onChange={(e) => setCurrentValue(e.target.value)}
                    defaultChecked={currentRadioValue === "tempE"}
                    id="templateE"
                  />
                  <label htmlFor="templateE">
                    <div className="offerCardHeader">Template E</div>
                    <div className="offerCardBody">
                      <div className="offerBodyRow">
                        <div className="labelData">Description</div>
                        <div className="valueData">
                          Some text for template E
                        </div>
                      </div>
                    </div>
                    <div className="offerCardFooter">
                      <div
                        className={
                          currentRadioValue === "tempE"
                            ? "button rounded primary"
                            : "button rounded secondary"
                        }
                      >
                        {currentRadioValue === "tempE"
                          ? "Selected"
                          : "Select Template"}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="card mt-10 cardInnerSplit">
            <div className="cardSidebar">
              <h2>Templates</h2>
              <ul>
                <li>
                  <Button classes="button withIcon transparent" onClick={""}>
                    <span>Template A</span>
                    <i>
                      <LinkArrowIc />
                    </i>
                  </Button>
                </li>
                <li className="active">
                  <Button classes="button withIcon transparent" onClick={""}>
                    <span>Template B</span>
                    <i>
                      <LinkArrowIc />
                    </i>
                  </Button>
                </li>
                <li>
                  <Button classes="button withIcon transparent" onClick={""}>
                    <span>Template C</span>
                    <i>
                      <LinkArrowIc />
                    </i>
                  </Button>
                </li>
                <li>
                  <Button classes="button withIcon transparent" onClick={""}>
                    <span>Template D</span>
                    <i>
                      <LinkArrowIc />
                    </i>
                  </Button>
                </li>
                <li>
                  <Button classes="button withIcon transparent" onClick={""}>
                    <span>Template E</span>
                    <i>
                      <LinkArrowIc />
                    </i>
                  </Button>
                </li>
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
                      <div className="formLabel"> Offer&apos;s Title: </div>
                      <div className="formField">
                        <input
                          className="formInput"
                          id="OfferTitle"
                          type="text"
                          {...register("OfferTitle", {
                            required: true,
                            minLength: 4,
                            maxLength: 24,
                            pattern: /^[a-z][a-z0-9_-]*/i,
                          })}
                        ></input>

                        <div className="fieldError">
                          {errors.OfferTitle &&
                            errors.OfferTitle.type === "required" && (
                              <span>
                                <p>required</p>
                              </span>
                            )}
                          {errors.OfferTitle &&
                            errors.OfferTitle.type === "maxLength" && (
                              <span>
                                <p>Max length is 24 chars</p>
                              </span>
                            )}
                          {errors.OfferTitle &&
                            errors.OfferTitle.type === "minLength" && (
                              <span>
                                <p>Min length is 4 chars</p>
                              </span>
                            )}
                          {errors.OfferTitle &&
                            errors.OfferTitle.type === "pattern" && (
                              <span>
                                <p>
                                  Start with an alphabet character. No spaces or
                                  special characters
                                </p>
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Offer&apos;s Description:</div>
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
                        ></textarea>

                        <div className="fieldError">
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "required" && (
                              <span>
                                <p>required</p>
                              </span>
                            )}
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "maxLength" && (
                              <span>
                                <p>Max length is 440 chars</p>
                              </span>
                            )}
                          {errors.OfferDescription &&
                            errors.OfferDescription.type === "minLength" && (
                              <span>
                                <p>Min length is 4 chars</p>
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Price (in ETH):</div>
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
                            <span>required</span>
                          )}
                          {errors.Price && errors.Price.type === "min" && (
                            <span>Min price is 0</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formLabel">Time to Deliver:</div>
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
                              <span>required</span>
                            )}
                          {errors.TimeToDeliver &&
                            errors.TimeToDeliver.type === "min" && (
                              <span>Min time to deliver is 0</span>
                            )}
                        </div>
                      </div>
                      <div className="filedInfo">
                        <Tooltip
                          title="In Hours, following acceptance of the offer"
                          placement="top"
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
              Offer Valid for (in Hours, after publishing the offer, 0=infinity): 
              <input className={styles.inlineField} id="OfferValidUntil" type="number" {...register('OfferValidUntil', { required: true, min : 0})} min="0" step="1" ></input> 
            </div>
            <div className={styles.gridItem}> 
              {errors.OfferValidUntil && errors.OfferValidUntil.type === "required" && <span>required</span> }
              {errors.OfferValidUntil && errors.OfferValidUntil.type === "min" && <span>Min time for a valid offer is 0</span>}
            </div>
            */}
                    <div className="formRow">
                      <div className="formLabel">Offer Valid Until</div>
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
                            value="No Expiry"
                            aria-label="offerValidity"
                          >
                            No Expiry
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
                          title="Loreim ipsum dummy"
                          placement="top"
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
                        Offer valid for these wallets:
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
                        <Tooltip title="empty=any" placement="top" arrow>
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
                          title="empty=Payzura Platform"
                          placement="top"
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
                      <Button
                        id="SubmitButton"
                        classes="button withIcon secondary"
                        type="submit"
                        // value="Submit"
                        ref={refButton}
                      >
                        <i>
                          <CheckIc />
                        </i>
                        <span>Submit</span>
                      </Button>
                    </div>
                  </div>
                </form>

                <p id="submitFeedback" hidden></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}