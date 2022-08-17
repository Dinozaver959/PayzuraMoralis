import React, { Fragment } from "react";
import Navigation from "../../components/Navigation";
const DOMPurify = require("isomorphic-dompurify");

function UserDetails(props) {
    const userDetails = props.userDetails;

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
          <div className="sectionMain">
            <h2 className="address">Address : {userDetails.userAddress}</h2>
            <div className="card">
              <div className="cardCategory">
                <div className="categoryBuyer">
                  <h1>As Buyer</h1>
                  <div className="cardHeader">
                    <div className="cardTitle">
                      <p>
                        Contracts created :{" "}
                        {userDetails.ContractsCreatedAsBuyer === undefined
                          ? "0"
                          : userDetails.ContractsCreatedAsBuyer}
                      </p>
                      <br />
                      <p>
                        Contracts involved :{" "}
                        {userDetails.ContractsInvolvedAsBuyer === undefined
                          ? "0"
                          : userDetails.ContractsInvolvedAsBuyer}
                      </p>
                      <br />
                      <p>
                        Contracts accepted :{" "}
                        {userDetails.ContractsAcceptedAsBuyer === undefined
                          ? "0"
                          : userDetails.ContractsAcceptedAsBuyer}
                      </p>
                      <br />
                      <p>
                        Confirm deliveries :{" "}
                        {userDetails.ConfirmedDeliveryAsBuyer === undefined
                          ? "0"
                          : userDetails.ConfirmedDeliveryAsBuyer}
                      </p>
                      <br />
                      <p>
                        Personalized contracts involved :{" "}
                        {userDetails.PersonalizedContractsInvolvedAsBuyer ===
                        undefined
                          ? "0"
                          : userDetails.PersonalizedContractsInvolvedAsBuyer}
                      </p>
                      <br />
                      <p>
                        Personalized contracts accepted :{" "}
                        {userDetails.PersonalizedContractsAcceptedAsBuyer ===
                        undefined
                          ? "0"
                          : userDetails.PersonalizedContractsAcceptedAsBuyer}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="categorySeller">
                  <h1>As Seller</h1>
                  <div className="cardHeader">
                    <div className="cardTitle">
                      <p>
                        Contracts created :{" "}
                        {userDetails.ContractsCreatedAsSeller === undefined
                          ? "0"
                          : userDetails.ContractsCreatedAsSeller}
                      </p>
                      <br />
                      <p>
                        Contracts involved :{" "}
                        {userDetails.ContractsInvolvedAsSeller === undefined
                          ? "0"
                          : userDetails.ContractsInvolvedAsSeller}
                      </p>
                      <br />
                      <p>
                        Disputes involved :{" "}
                        {userDetails.DisputesInvolvedInAsSeller === undefined
                          ? "0"
                          : userDetails.DisputesInvolvedInAsSeller}
                      </p>
                      <br />
                      <p>
                        Disputes in favor of the buyer :{" "}
                        {userDetails.DisputesInFavorOfBuyer === undefined
                          ? "0"
                          : userDetails.DisputesInFavorOfBuyer}
                      </p>
                      <br />
                      <p>
                        Personalized contracts involved :{" "}
                        {userDetails.PersonalizedContractsInvolvedAsSeller ===
                        undefined
                          ? "0"
                          : userDetails.PersonalizedContractsInvolvedAsSeller}
                      </p>
                      <br />
                      <p>
                        Personalized contracts created :{" "}
                        {userDetails.PersonalizedContractsCreatedAsSeller ===
                        undefined
                          ? "0"
                          : userDetails.PersonalizedContractsCreatedAsSeller}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <br />
          </div>
        </div>
      </Fragment>
    );
  }


export default UserDetails;

function validateInput(userAddress) {
    const validated = /^(0x[a-f0-9A-F]{40})$/.test(userAddress);
    return validated;
}

export async function getServerSideProps({ params }) {
    const userAddress = DOMPurify.sanitize(params.userAddress);
    const valid = validateInput(userAddress);
    console.log("userAddress valid: ", valid);
    console.log("userAddress: ", userAddress);

    // if true, return query, otherwise return error message
    if (valid) {
        const userDetails = await fetch(
            `http://localhost:3000/api/api-getUserDetails?UserWallet=${userAddress}`
        ).then((r) => r.json()); // need to replace with payzura global path

        if (userDetails.length > 0) {
            return {
                props: {
                    userDetails: userDetails[0]["name"],
                },
            };
        }
    }

    return {
        notFound: true,
    };
}
