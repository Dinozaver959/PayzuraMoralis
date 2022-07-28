import "../styles/globals.scss";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { useState } from "react";

import NextNProgress from "./../components/ui/NextNProgress";

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

  return (
    <div className={darkMode ? "layoutMain darkMode" : "layoutMain"}>
      <MoralisProvider
        appId='8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF'
        serverUrl='https://fordrbswdskl.usemoralis.com:2053/server'
      >
        <Head>
          <title>Payzura</title>
          <meta name='description' content='Create trust with anonymity' />

          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
          <meta name='msapplication-TileColor' content='#da532c' />
          <meta name='theme-color' content='#ffffff'></meta>
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
        />
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
