import { useRouter} from 'next/router'
import React from "react";
const DOMPurify = require('isomorphic-dompurify');


function UserDetails({userDetails}){

    /*
    console.log("userAddress: ", userDetails.userAddress);
    console.log("AgreementsMade: ", userDetails.AgreementsMade);
    console.log("DisputesInvolved: ", userDetails.DisputesInvolved);

    console.log("DisputesManaged: ", userDetails.DisputesManaged);
    console.log("DisputesInFavorOfBuyer: ", userDetails.DisputesInFavorOfBuyer);
    */

    return (
        <div> 
            <h2>userAddress: {userDetails.userAddress}</h2>

            <p>
                Involved in disputes as buyer/seller (yea, we need to distinguish between buyer and seller case when recording in DB):
                <br/>
                AgreementsMade: {userDetails.AgreementsMade}
                <br/>
                DisputesInvolved: {userDetails.DisputesInvolved}
            </p>

            <br/>
            <br/>

            <p>
                Disputes voted on as arbiter:
                <br/>
                DisputesManaged: {userDetails.DisputesManaged}
                <br/>
                DisputesInFavorOfBuyer: {userDetails.DisputesInFavorOfBuyer}
            </p>
        </div>
    )
}

export default UserDetails;


function validateInput(userAddress){
    const validated = (/^(0x[a-f0-9A-F]{40})$/.test(userAddress));
    return validated;
}


export async function getServerSideProps({ params }){

    const userAddress = DOMPurify.sanitize(params.userAddress);
    const valid = validateInput(userAddress);
    console.log("userAddress valid: ", valid);
    console.log("userAddress: ", userAddress);

    // if true, return query, otherwise return error message
    if(valid){

        const userDetails = await fetch(`http://localhost:3000/api/api-getUserDetails?UserWallet=${userAddress}`).then(r => r.json());         // need to replace with payzura global path

        if(userDetails.length > 0){
            return {
                props: {
                    userDetails : userDetails[0]["name"]
                }
            } 
        } 
    } 

    return {
        notFound: true
    }
}