import { Fragment } from "react";
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

          hasMenuDrawer={props.hasMenuDrawer}
          setMenuDrawer={props.setMenuDrawer}
          mobileDrawerFn={props.mobileDrawerFn}
        />

        <div className="containerMain">
          <div className="pageHeader">
            <h1>Dashboard</h1>
          </div>

          <main className="main">Dashboard from Dune Analytics...</main>
        </div>
      </Authenticate>
    </Fragment>
  );
}
