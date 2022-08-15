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
        hasMenuDrawer={props.hasMenuDrawer}
        setMenuDrawer={props.setMenuDrawer}
        mobileDrawerFn={props.mobileDrawerFn}
        currentAccount={props.currentAccount}
        setCurrentAccount={props.setCurrentAccount}
      />

      <div className="containerMain">
        <div className="pageHeader">
          <h1>State of the platform</h1>
        </div>

        <main className="main">Note: the contracts are still in constant development and with every new contract deployed we would need to redo the graphs on Dune Analytics. Hence these are just examples for now.</main>
        <br></br>
        <br></br>

        <div className="ContainerDashboard">
          <iframe src="https://dune.com/embeds/984240/1705287/3684dc7f-f06b-4579-ba59-d3d498b81c10" height="500" width="500" title="chart 1"></iframe>

          <iframe src="https://dune.com/embeds/1019187/1759672/84fd7fda-e023-41d6-a43a-5d15364d4037" height="500" width="500" title="chart 1"></iframe>

          <iframe src="https://dune.com/embeds/1019187/1759668/ac505790-6db9-45cb-ae6f-a4f4509c5ed2" height="500" width="500" title="chart 1"></iframe>
        </div>

      </div>
    </Fragment>
  );
}
