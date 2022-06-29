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
        />

        <div className="containerMain">


          <main className="main">
            Dashboard from Dune Analytics...
          </main>


        </div>
      </Authenticate>
    </Fragment>
  );
}
