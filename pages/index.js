import { Fragment } from "react";
import {
  clonedContractsIndex_Moralis_indexPage,
  GetAddress_Moralis,
  GetBalance_Moralis,
  GetTimeLeftToDeadline_Moralis,
  GetArbiter_Moralis,
  GetBuyer_Moralis,
  GetSeller_Moralis,
  GetState_Moralis,
  GetPrice_Moralis_indexPage,
  GetDeadline_Moralis,
  GetHashOfDescription_Moralis,
  GetGracePeriod_Moralis,
  CreateEscrow_Moralis_indexPage,
  AcceptOffer_Moralis_indexPage,
  ReturnPayment_Moralis_indexPage,
  ClaimFunds_Moralis_indexPage,
  StartDispute_Moralis_indexPage,
  ConfirmDelivery_Moralis_indexPage,
  HandleDispute_Moralis,
} from "../JS/local_web3_Moralis";

import Authenticate from "../components/Authenticate";
import LoginButton from "../components/LoginButton";
import Navigation from "../components/Navigation.js";

export default function Home(props) {
  return (
    <Fragment>
      <LoginButton />

      <Authenticate>
        <Navigation
          darkMode={props.darkMode}
          changeDarkMode={props.changeDarkMode}
          dropdownOpen={props.dropdownOpen}
          setDropdownOpen={props.setDropdownOpen}
          OpenDropdownFn={props.OpenDropdownFn}
        />

        <div className="container">
          <main className="main">
            MAKE SURE YOU ARE USING RINKEBY!!!!
            <br></br>
            <br></br>
            Use this for now to choose an agreement (starts with 0 !! So if
            there are 4 agreements, Agreement 3 is the last one)
            <input
              className="gridItemMint"
              id="Contract_Index"
              type="number"
              placeholder="0"
              min="0"
            ></input>
            <div className="gridContainer_2">
              <input
                className="interactButton"
                type="submit"
                value="Number of Agreements"
                onClick={() => clonedContractsIndex_Moralis_indexPage()}
              ></input>
              <div className="display" id="clonedContractsIndex_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Address"
                onClick={() => GetAddress_Moralis()}
              ></input>
              <div className="display" id="GetAddress_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Balance"
                onClick={() => GetBalance_Moralis()}
              ></input>
              <div className="display" id="GetBalance_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get TimeLeftToDeadline"
                onClick={() => GetTimeLeftToDeadline_Moralis()}
              ></input>
              <div className="display" id="GetTimeLeftToDeadline_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Arbiter"
                onClick={() => GetArbiter_Moralis()}
              ></input>
              <div className="display" id="GetArbiter_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Buyer"
                onClick={() => GetBuyer_Moralis()}
              ></input>
              <div className="display" id="GetBuyer_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Seller"
                onClick={() => GetSeller_Moralis()}
              ></input>
              <div className="display" id="GetSeller_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get State"
                onClick={() => GetState_Moralis()}
              ></input>
              <div className="display" id="GetState_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Price"
                onClick={() => GetPrice_Moralis_indexPage()}
              ></input>
              <div className="display" id="GetPrice_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get Deadline"
                onClick={() => GetDeadline_Moralis()}
              ></input>
              <div className="display" id="GetDeadline_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get HashOfDescription"
                onClick={() => GetHashOfDescription_Moralis()}
              ></input>
              <div className="display" id="GetHashOfDescription_Display"></div>
              <input
                className="interactButton"
                type="submit"
                value="Get GracePeriod"
                onClick={() => GetGracePeriod_Moralis()}
              ></input>
              <div className="display" id="GetGracePeriod_Display"></div>
              <br></br>
              <br></br>
              <div></div>
              <div></div>
              sample input for create offer:
              10000000000,1,a23e5fdcd7b276bdd81aa1a0b7b963101863dd3f61ff57935f8c5ba462681ea6
              {/* for the offer description, just store description + hash(desription) to the Moralis DB */}
              <input
                className="interactButton"
                type="submit"
                value="Create Offer (seller)"
                onClick={() => CreateEscrow_Moralis_indexPage()}
              ></input>
              <input
                className="interactButton"
                id="CreateEscrow_Input"
                type="string"
              ></input>
              <input
                className="interactButton"
                type="submit"
                value="Accept Offer (buyer)"
                onClick={() => AcceptOffer_Moralis_indexPage()}
              ></input>
              <div></div>
              <input
                className="interactButton"
                type="submit"
                value="Return payment (seller)"
                onClick={() => ReturnPayment_Moralis_indexPage()}
              ></input>
              <div></div>
              <input
                className="interactButton"
                type="submit"
                value="Claim Funds (seller)"
                onClick={() => ClaimFunds_Moralis_indexPage()}
              ></input>
              <div></div>
              <input
                className="interactButton"
                type="submit"
                value="Confirm Delivery (buyer)"
                onClick={() => ConfirmDelivery_Moralis_indexPage()}
              ></input>
              <div></div>
              <input
                className="interactButton"
                type="submit"
                value="Start Dispute (buyer)"
                onClick={() => StartDispute_Moralis_indexPage()}
              ></input>
              <div></div>
              <input
                className="interactButton"
                type="submit"
                value="Handle Dispute (arbiter)"
                onClick={() => HandleDispute_Moralis()}
              ></input>
              <div></div>
            </div>
          </main>
        </div>
      </Authenticate>
    </Fragment>
  );
}
