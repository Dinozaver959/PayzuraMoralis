import React, { useState, useEffect, Fragment } from "react";

import { GetWallet_NonMoralis } from "../JS/local_web3_Moralis";
import Navigation from "../components/Navigation.js";

import TabsUi from "../components/ui/TabsUi";
import MyContractsContainer from "../components/my-contracts/MyContracts";
import OffersContainer from "../components/my-contracts/Offers";
import ValidatesContainer from "../components/my-contracts/Validates";

export default function MyAgreements(props) {
  const [data, setData] = useState([]);
  const [dataGetMyContracts, setDataGetMyContracts] = useState([]);
  const [dataContractsOffered, setDataContractsOffered] = useState([]);
  const [dataContractsToValidate, setDataContractsToValidate] = useState([]);
  const [placeholder, setPlaceholder] = useState(true);
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  // Responsive show/hide filters function
  function toggleFiltersHandler() {
    setFiltersOpen(!isFiltersOpen);
    console.log(isFiltersOpen);
  }

  // APIs
  async function getCollectionsDetails() {
    const connectedAddress = await GetWallet_NonMoralis();

    const dataGetMyContracts = await fetch(
      `./api/api-getMyContracts` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setDataGetMyContracts(json));
    setPlaceholder(false);

    const dataContractsOffered = await fetch(
      `./api/api-getContractsOffered` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setDataContractsOffered(json));
    setPlaceholder(false);

    const dataContractsToValidate = await fetch(
      `./api/api-getContractsToValidate` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((json) => setDataContractsToValidate(json));
    setPlaceholder(false);

    return data;
  }

  // Calling the function on component mount
  useEffect(() => {
    getCollectionsDetails();
  }, [props.currentAccount]);

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
        <TabsUi
          titles={["My Contracts", "Offers", "Validate"]}
          details={[
            <MyContractsContainer
              key="0"
              dataGetMyContracts={dataGetMyContracts}
              placeholder={placeholder}
              currentAccount={props.currentAccount}
              isFiltersOpen={isFiltersOpen}
              toggleFiltersFn={toggleFiltersHandler}
            />,
            <OffersContainer
              key="1"
              dataContractsOffered={dataContractsOffered}
              placeholder={placeholder}
              currentAccount={props.currentAccount}
              isFiltersOpen={isFiltersOpen}
              toggleFiltersFn={toggleFiltersHandler}
            />,
            <ValidatesContainer
              key="2"
              dataContractsToValidate={dataContractsToValidate}
              placeholder={placeholder}
              currentAccount={props.currentAccount}
              isFiltersOpen={isFiltersOpen}
              toggleFiltersFn={toggleFiltersHandler}
            />,
          ]}
        />
      </div>
    </Fragment>
  );
}
