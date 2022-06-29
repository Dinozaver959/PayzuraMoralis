import { Fragment } from "react";
import Navigation from "../components/Navigation";

function ServicesSeeked(props) {
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
        <div className="pageHeader">
          <h1>Coming Soon...</h1>
        </div>
      </div>
    </Fragment>
  );
}

export default ServicesSeeked;
