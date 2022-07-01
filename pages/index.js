import { Fragment } from "react";
import Navigation from "../components/Navigation.js";

export default function Home(props) {
  return (
    <Fragment>

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
    </Fragment>
  );
}
