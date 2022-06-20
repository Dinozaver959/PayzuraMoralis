import "../styles/globals.scss";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setdropdownOpen] = useState(false);

  function changeDarkModeHalndler() {
    setDarkMode(!darkMode);
  }

  function OpenDropdownHalndler() {
    setdropdownOpen(!dropdownOpen);
  }

  return (
    <div className={darkMode ? "layoutMain darkMode" : "layoutMain"}>
      <MoralisProvider
        appId="8AGWP86FEWcfCRwNLa0LGffGPs5kpcHxqRpEp4PF"
        serverUrl="https://fordrbswdskl.usemoralis.com:2053/server"
      >
        <Head>
          <title>Payzura</title>
          <meta name="description" content="Create trust with anonymity" />

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
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <Component
          {...pageProps}
          darkMode={darkMode}
          changeDarkMode={changeDarkModeHalndler}

          dropdownOpen={dropdownOpen}
          OpenDropdownFn={OpenDropdownHalndler}
        />
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
