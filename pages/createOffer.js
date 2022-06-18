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
import Button from "../components/ui/Button";
import RightArrowIc from "../components/icons/RightArrow";

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

  async function SubmitForm() {
    // call Smart Contract function
    CreateEscrow_Moralis(
      10 ** 18 * document.getElementById("Price").value,
      document.getElementById("TimeToDeliver").value,
      sha256(document.getElementById("OfferDescription").value),
      OfferValidUntil.getTime() / 1000,
      document.getElementById("PersonalizedOffer").value
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

  return (
    <>
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>Offers Creation</h1>
        </div>

        <div className="card mt-10">
          <div className="cardHeader">
            <div className="cardTitle">
              <h2>Choose a Template</h2>
              <p>
                This will help you to generate by default template for creating
                offer.
              </p>
            </div>

            <div className="cardAction">
              <Button classes="button secondary rounded withIcon" onClick={""}>
                <span>Continue</span>
                <i>
                  <RightArrowIc />
                </i>
              </Button>
            </div>
          </div>

          <div className="cardBody">
            <div className="offerTemplateMain">
              <div className="offerCard">
                <div className="offerCardHeader">Alpha Template</div>
                <div className="offerCardBody">
                  <div className="offerBodyRow">
                    <div className="labelData">Description</div>
                    <div className="valueData">valueData</div>
                  </div>
                </div>
                <div className="offerCardFooter">
                  <Button classes="button rounded primary" onClick={""}>
                    Select Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="FormContainer">
        <div className="createTitle">Offer Creation</div>
        <br></br>

        <form
          id="formToSubmit"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="gridContainer_1">
            <div className="gridItem"> Offer&apos;s Title: </div>
            <input
              className="gridItem"
              id="OfferTitle"
              type="text"
              {...register("OfferTitle", {
                required: true,
                minLength: 4,
                maxLength: 24,
                pattern: /^[a-z][a-z0-9_-]*/i,
              })}
            ></input>
            <div className="gridItem">
              {errors.OfferTitle && errors.OfferTitle.type === "required" && (
                <span>
                  <p>required</p>
                </span>
              )}
              {errors.OfferTitle && errors.OfferTitle.type === "maxLength" && (
                <span>
                  <p>Max length is 24 chars</p>
                </span>
              )}
              {errors.OfferTitle && errors.OfferTitle.type === "minLength" && (
                <span>
                  <p>Min length is 4 chars</p>
                </span>
              )}
              {errors.OfferTitle && errors.OfferTitle.type === "pattern" && (
                <span>
                  <p>
                    Start with an alphabet character. No spaces or special
                    characters
                  </p>
                </span>
              )}
            </div>

            <div className="gridItem"> Offer&apos;s Description: </div>
            <textarea
              cols="40"
              rows="10"
              className="gridItem"
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
            <div className="gridItem">
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

            <div className="gridItem">
              Price (in ETH):
              <input
                className="inlineField"
                id="Price"
                type="number"
                {...register("Price", { required: true, min: 0 })}
                min="0"
                step="0.001"
              ></input>
            </div>
            <div className="gridItem">
              {errors.Price && errors.Price.type === "required" && (
                <span>required</span>
              )}
              {errors.Price && errors.Price.type === "min" && (
                <span>Min price is 0</span>
              )}
            </div>

            <div className="gridItem">
              Time to Deliver (in Hours, following acceptance of the offer):
              <input
                className="inlineField"
                id="TimeToDeliver"
                type="number"
                {...register("TimeToDeliver", { required: true, min: 0 })}
                min="0"
                step="1"
              ></input>
            </div>
            <div className="gridItem">
              {errors.TimeToDeliver &&
                errors.TimeToDeliver.type === "required" && (
                  <span>required</span>
                )}
              {errors.TimeToDeliver && errors.TimeToDeliver.type === "min" && (
                <span>Min time to deliver is 0</span>
              )}
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Offer Valid Until"
                renderInput={(params) => <TextField {...params} />}
                value={OfferValidUntil}
                onChange={(newValue) => {
                  setOfferValidUntil(newValue);
                }}
              />
            </LocalizationProvider>

            <div className="gridItem">
              {" "}
              Offer valid for these wallets (empty=any):{" "}
            </div>
            <input
              className="gridItem"
              id="PersonalizedOffer"
              type="text"
              name="PersonalizedOffer"
            ></input>

            {/*
              <div className={styles.gridItem}> Offer valid for these wallets (empty=any):  </div>
              <input className={styles.gridItem} id="PersonalizedOffer" type="text" {...register('PersonalizedOffer', { pattern: /^[a-z0-9,] /i })} ></input>
              <div className={styles.gridItem}> 
                {errors.PersonalizedOffer && errors.PersonalizedOffer.type === "pattern" && <span><p>Comma separated wallet addresses</p></span> }
              </div>
             */}

            <div className="submitButtonOuter">
              <input
                id="SubmitButton"
                className="submitButton"
                type="submit"
                value="Submit"
                ref={refButton}
              ></input>
            </div>
          </div>
        </form>

        <p id="submitFeedback" hidden></p>
      </div>
    </>
  );
}
