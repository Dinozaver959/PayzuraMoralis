import React, { useRef } from 'react'
import styles from "../styles/CreateContent.module.scss";
import { useForm  } from "react-hook-form";
import Moralis from 'moralis';
import { sha256 } from 'js-sha256';
import {GetWallet_NonMoralis, clonedContractsIndex_Moralis, CreateEscrow_Moralis} from "../JS/local_web3_Moralis";



export default function Description() {

  // SUBMIT - validation
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const onSubmit = data => SubmitForm();  // console.log(data);

  async function SubmitForm(){
    
    // call Smart Contract function
    CreateEscrow_Moralis( (10**18) *  document.getElementById('Price').value, document.getElementById('TimeAllowed').value, sha256(document.getElementById('ProposalDescription').value))    // price, timeAllowedInHours, hashOfDescription
    .then(async (transactionHash) => {

      // show the feedback text 
      document.getElementById('submitFeedback').style.display = 'inline';
      document.getElementById('submitFeedback').innerText = 'Creating proposal...'

      var form = document.querySelector('form');
      var formData = new FormData(form);
      formData.append('SellerAccount', (Moralis.User.current()).id);

      // read the current number of agreements to figure out what is the agreement index for this case
      const index = (await clonedContractsIndex_Moralis()) - 1;
      console.log("new index: " + index);
      formData.append('index', index);

      const connectedAddress = await GetWallet_NonMoralis();
      formData.append('SellerWallet', connectedAddress);

      formData.append('hashDescription', sha256(document.getElementById('ProposalDescription').value));
      formData.append('transactionHash', transactionHash);
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/api-createProposal', false);
      xhr.onload = function () {
        // do something to response
        // console.log(this.responseText);

        // update the feedback text 
        document.getElementById('submitFeedback').style.display = 'inline';
        document.getElementById('submitFeedback').innerText = 'proposal created'

        // prevent the Submit button to be clickable and functionable
        removeHover()
        document.getElementById('SubmitButton').disabled = true

        // think about also removing the hover effect
        // you can create a seperate class for the hover (can be reused on other elements as well) and just remove the hover class from this element
        console.log("proposal created")
      };
      xhr.send(formData);
    }).
    catch((error) => {
      console.error(error);
      console.log("create proposal error code: " + error.code);
      console.log("create proposal error message: " + error.message);
      if(error.data && error.data.message){document.getElementById('submitFeedback').innerText = error.data.message;}
      else {document.getElementById('submitFeedback').innerText = error.message;}    
      document.getElementById('submitFeedback').style.visibility = "visible";
      process.exitCode = 1;
    })
  }


  // update Submit button
  const refButton = useRef(null);
  function removeHover(){
    const b1 = refButton.current;                 // corresponding DOM node
    b1.className = styles.submitButton_noHover;   // overwrite the style with no hover
  }


  return (

    <> 
      <div className={styles.FormContainer}>
        <div className={styles.createTitle}>
          Proposal Creation
        </div><br></br>

        <form id="formToSubmit" method="post" encType="multipart/form-data"  onSubmit={handleSubmit(onSubmit)}>              

          <div className={styles.gridContainer_1}> 


            <div className={styles.gridItem}> Proposal&apos;s Title:  </div>
            <input className={styles.gridItem} id="ProposalTitle" type="text" {...register('ProposalTitle', { required: true, minLength: 4, maxLength: 24, pattern: /^[a-z][a-z0-9_-]*/i })} ></input>
            <div className={styles.gridItem}> 
              {errors.ProposalTitle && errors.ProposalTitle.type === "required" && <span><p>required</p></span> }
              {errors.ProposalTitle && errors.ProposalTitle.type === "maxLength" && <span><p>Max length is 24 chars</p></span> }
              {errors.ProposalTitle && errors.ProposalTitle.type === "minLength" && <span><p>Min length is 4 chars</p></span>}
              {errors.ProposalTitle && errors.ProposalTitle.type === "pattern" && <span><p>Start with an alphabet character. No spaces or special characters</p></span> }
            </div>

            <div className={styles.gridItem}> Proposal&apos;s Description:  </div> 
            <textarea cols="40" rows="10" className={styles.gridItem} id="ProposalDescription" type="text" width="200" height="80" {...register('ProposalDescription', { required: true, minLength: 4, maxLength: 440})} ></textarea>
            <div className={styles.gridItem}> 
              {errors.ProposalDescription && errors.ProposalDescription.type === "required" && <span><p>required</p></span> }
              {errors.ProposalDescription && errors.ProposalDescription.type === "maxLength" && <span><p>Max length is 440 chars</p></span> }
              {errors.ProposalDescription && errors.ProposalDescription.type === "minLength" && <span><p>Min length is 4 chars</p></span>}
            </div>

            <div className={styles.gridItem}> 
              Price (in ETH): 
              <input className={styles.inlineField} id="Price" type="number" {...register('Price', { required: true, min : 0})} min="0" step="0.001" ></input> 
            </div>
            <div className={styles.gridItem}> 
              {errors.Price && errors.Price.type === "required" && <span>required</span> }
              {errors.Price && errors.Price.type === "min" && <span>Min price is 0</span>}
            </div>

            <div className={styles.gridItem}> 
              Time allowed (in Hours following acceptance of the proposal): 
              <input className={styles.inlineField} id="TimeAllowed" type="number" {...register('TimeAllowed', { required: true, min : 0})} min="0" step="1" ></input> 
            </div>
            <div className={styles.gridItem}> 
              {errors.TimeAllowed && errors.TimeAllowed.type === "required" && <span>required</span> }
              {errors.TimeAllowed && errors.TimeAllowed.type === "min" && <span>Min time allowed is 0</span>}
            </div>


          </div>

                  
          <div className={styles.submitButtonOuter}> 
            <input id="SubmitButton" className={styles.submitButton} type="submit" value="Submit" ref={refButton} ></input>
          </div>

        </form>

        <p id="submitFeedback" hidden></p>
      </div>
    </>
  )
}