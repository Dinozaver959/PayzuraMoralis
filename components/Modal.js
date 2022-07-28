import React, { useState, useEffect } from "react";
const DOMPurify = require("isomorphic-dompurify");

const Modal = (props) => {
  return (
    <>
      <div>
        <div className='modal'>
          <div className='modalHeader'>
            <small className='itemModal'>
              <h3>Address : </h3>0xd0c0124a2e4a3514e0d0a951b259d4470cfe104e
            </small>
            <small className='itemModal'>
              <h3>Agreements made : </h3>2
            </small>
            <small className='itemModal'>
              <h3>Contracts Created as seller : </h3>2
            </small>
            <small className='itemModal'>
              <h3>Contracts involved as seller : </h3>0
            </small>
            <small className='itemModal'>
              <h3>Disputes involved in as seller : </h3>1
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

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
