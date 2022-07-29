import "../styles/globals.scss";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import React, { useState, useEffect } from "react";

import NextNProgress from "./../components/ui/NextNProgress";
import { useRouter } from "next/router";

import {
    GetWallet_NonMoralis,
    ReturnPayment_Moralis,
    ClaimFunds_Moralis,
    StartDispute_Moralis,
    ConfirmDelivery_Moralis,
} from "../JS/local_web3_Moralis";


function MyApp({ Component, pageProps }) {
    const [darkMode, setDarkMode] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasMenuDrawer, setMenuDrawer] = useState(false);

    // Light and Dark Mode function
    function changeDarkModeHalndler() {
        setDarkMode(!darkMode);
    }

    // Header drop-down function
    function OpenDropdownHalndler() {
        setDropdownOpen(!dropdownOpen);
    }

    // Responsive mobile menu drawer function
    function toggleMobileDrawerHandler() {
        setMenuDrawer(!hasMenuDrawer);
    }





    const [data, setData] = useState([]);
    const [dataOnlyBuyer, setDataOnlyBuyer] = useState([]);
    const [dataOnlySeller, setDataOnlySeller] = useState([]);
    const [placeholder, setPlaceholder] = useState(true);

    async function getCollectionsDetails() {
        // setPlaceholder(true);
        const connectedAddress = await GetWallet_NonMoralis();
        // const data = await fetch(`./api/api-getUserAgreements`)   /// append user wallet
        const data = await fetch(
            `./api/api-getUserAgreements` + "?UserWallet=" + connectedAddress
        )
            .then((res) => res.json())
            .then((json) => setData(json));

        const dataOnlyBuyer = await fetch(
            `./api/api-getUserAgreementsOnlyBuyer` +
                "?UserWallet=" +
                connectedAddress
        )
            .then((res) => res.json())
            .then((json) => setDataOnlyBuyer(json));

        const dataOnlySeller = await fetch(
            `./api/api-getUserAgreementsOnlySeller` +
                "?UserWallet=" +
                connectedAddress
        )
            .then((res) => res.json())
            .then((json) => setDataOnlySeller(json));
        setPlaceholder(false);

        console.log("data:");
        console.log(data);
        console.log("dataOnlyBuyer:");
        console.log(dataOnlyBuyer);
        console.log("dataOnlySeller:");
        console.log(dataOnlySeller);
        return data;
    }

    const router = useRouter();
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
            window.ethereum.on("accountsChanged", () => {
                // window.location.reload();
                getCollectionsDetails();
                // router.push("/", "/", { shallow: true });
                // router.push("/contracts-listed", "/contracts-listed", {
                //     shallow: false,
                // });
            });
        }
    }, []);

    useEffect(() => {
        getCollectionsDetails();
    }, []);

    return (
        <div className={darkMode ? "layoutMain darkMode" : "layoutMain"}>
            <MoralisProvider
                appId="8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF"
                serverUrl="https://fordrbswdskl.usemoralis.com:2053/server"
            >
                <Head>
                    <title>Payzura</title>
                    <meta
                        name="description"
                        content="Create trust with anonymity"
                    />

                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link
                        rel="mask-icon"
                        href="/safari-pinned-tab.svg"
                        color="#5bbad5"
                    />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff"></meta>
                </Head>

                <NextNProgress />
                <Component
                    {...pageProps}
                    darkMode={darkMode}
                    changeDarkMode={changeDarkModeHalndler}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    OpenDropdownFn={OpenDropdownHalndler}
                    hasMenuDrawer={hasMenuDrawer}
                    setMenuDrawer={setMenuDrawer}
                    mobileDrawerFn={toggleMobileDrawerHandler}

                    dataOnlyBuyer={dataOnlyBuyer}
                    dataOnlySeller={dataOnlySeller}
                    placeholder={placeholder}
                />
            </MoralisProvider>
        </div>
    );
}

export default MyApp;
