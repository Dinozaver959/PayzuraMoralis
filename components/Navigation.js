import React, { useRef, useState, useEffect } from "react";
import { GetWallet_NonMoralis } from "../JS/local_web3_Moralis";

import Link from "next/link";
import { useRouter } from "next/router";
import Tooltip from "@mui/material/Tooltip";

import Button from "./ui/Button";
import NotificationIc from "./icons/Notification";
import UserProfileIc from "./icons/UserProfile";
import MoonIc from "./icons/Moon";
import SunIc from "./icons/Sun";
import UserIc from "./icons/User";
import AgreementIc from "./icons/Agreement";
import SettingsIc from "./icons/Settings";
import LogoutIc from "./icons/Logout";
import DisputeIc from "./icons/Dispute";
import PersonlaizedContractsIc from "./icons/PersonlaizedContracts";

import useOutsideClick from "./../components/useOutsideClick";
import CloseIc from "./icons/Close";
import MobileMenuIc from "./icons/MobileMenu";
import PlusIc from "./icons/Plus";

import ConnectWallet from "./../components/ConnectWallet";
import Notifications from "./../components/Notifications";
import ModalUi from "./ui/ModalUi";
import ServicesListedIc from "./icons/ServicesListed";

export default function Navigation(props) {
  const {
    darkMode,
    dropdownOpen,
    setDropdownOpen,
    hasMenuDrawer,
    setMenuDrawer,
    currentAccount,
  } = props;

  const router = useRouter();

  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => {
    if (dropdownOpen) setDropdownOpen(false);
  });
 
  const drawerRef = useRef();
  useOutsideClick(drawerRef, () => {
    if (hasMenuDrawer === false) setMenuDrawer(false);
  });

  const [modelData, setModelData] = React.useState({
    show: false,
  });

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }
  
  const [notificationsRead, setNotificationsRead] = useState(true);

  async function apis() {
    const connectedAddress = await GetWallet_NonMoralis();
    const dataNotifications = await fetch(
      `./api/api-getMyNotificationUnreadCount` + "?UserWallet=" + connectedAddress
    )
      .then((res) => res.json())
      .then((count) => { //
        setNotificationsRead(count > 0 ? false : true)
      });
  }

  useEffect(() => {
    apis() 
  }, [])

  return (
    <header className={hasMenuDrawer ? "drawerOpen" : ""}>
      <div className='logo'>
        <Link href='/'>
          <svg viewBox='0 0 163 38'>
            <path d='M157.744,28.982 L157.623,25.809 C156.099,28.042 153.692,29.374 150.362,29.374 C144.505,29.374 140.013,25.026 140.013,18.523 C140.013,11.903 144.505,7.477 150.362,7.477 C153.692,7.477 156.099,8.809 157.623,11.042 L157.744,7.869 L162.999,7.869 L162.999,28.982 L157.744,28.982 ZM151.606,12.021 C148.036,12.021 145.669,14.606 145.669,18.445 C145.669,22.245 148.036,24.790 151.606,24.790 C155.136,24.790 157.543,22.245 157.543,18.406 C157.543,14.606 155.136,12.021 151.606,12.021 ZM131.266,17.661 L131.266,28.982 L125.811,28.982 L125.811,7.869 L131.066,7.869 L131.146,10.689 C132.871,8.613 135.599,7.477 139.090,7.477 L138.728,12.373 C134.235,12.373 131.266,14.489 131.266,17.661 ZM110.446,29.374 C104.348,29.374 100.336,25.848 100.336,20.560 L100.336,7.869 L105.792,7.869 L105.792,20.286 C105.792,22.989 107.637,24.790 110.446,24.790 C113.214,24.790 115.059,22.989 115.059,20.286 L115.059,7.869 L120.515,7.869 L120.515,20.560 C120.515,25.848 116.503,29.374 110.446,29.374 ZM77.470,25.535 L88.261,12.217 L77.670,12.217 L77.670,7.869 L95.963,7.869 L96.003,11.277 L85.252,24.595 L96.445,24.595 L96.445,28.982 L77.470,28.982 L77.470,25.535 ZM61.383,37.992 C57.972,37.992 54.964,37.091 52.757,35.328 L53.961,31.137 C56.127,32.743 58.494,33.409 61.262,33.409 C65.113,33.409 67.721,30.862 67.721,26.945 L67.721,26.554 C66.156,28.395 63.829,29.374 61.182,29.374 C56.288,29.374 52.958,26.084 52.958,21.109 L52.958,7.869 L58.414,7.869 L58.414,20.286 C58.414,22.989 60.299,24.790 63.107,24.790 C65.876,24.790 67.721,22.989 67.721,20.286 L67.721,7.869 L73.177,7.869 L73.177,26.984 C73.177,33.643 68.483,37.992 61.383,37.992 ZM42.327,25.809 C40.802,28.042 38.395,29.374 35.065,29.374 C29.208,29.374 24.715,25.026 24.715,18.523 C24.715,11.903 29.208,7.477 35.065,7.477 C38.395,7.477 40.802,8.809 42.327,11.042 L42.447,7.869 L47.702,7.869 L47.702,28.982 L42.447,28.982 L42.327,25.809 ZM36.309,12.021 C32.739,12.021 30.372,14.606 30.372,18.445 C30.372,22.245 32.739,24.790 36.309,24.790 C39.839,24.790 42.246,22.245 42.246,18.406 C42.246,14.606 39.839,12.021 36.309,12.021 ZM11.837,19.111 L5.659,19.111 L5.659,28.982 L0.003,28.982 L0.003,-0.005 L12.037,-0.005 C18.296,-0.005 22.428,3.756 22.428,9.357 C22.428,15.194 18.215,19.111 11.837,19.111 ZM11.436,4.578 L5.659,4.578 L5.659,14.528 L11.436,14.528 C14.645,14.528 16.611,12.530 16.611,9.553 C16.611,6.576 14.565,4.578 11.436,4.578 Z' />
          </svg>
        </Link>
      </div>

      <div className='mobileHeaderWallet'>
        <ConnectWallet
          currentAccount={props.currentAccount}
          setCurrentAccount={props.setCurrentAccount}
        />
      </div>

      <nav className='navbarMain' ref={drawerRef}>
        <div className={hasMenuDrawer ? "navbarClose show" : "navbarClose"}>
          <CloseIc onClick={props.mobileDrawerFn} />
        </div>
        <ul>
          <li
            className={router.pathname == "/" ? "active" : ""}
            onClick={props.mobileDrawerFn}
          >
            <Link href='/'>Dashboard</Link>
          </li>
          {/* <li
            className={router.pathname == "/contracts-listed" ? "active" : ""}
            onClick={props.mobileDrawerFn}
          >
            <Link href='/contracts-listed'>Contracts Listed</Link>
          </li> */}
          {/* <li
            className={router.pathname == "/contracts-seeked" ? "active" : ""}
            onClick={props.mobileDrawerFn}
          >
            <Link href='/contracts-seeked'>Contracts Seeked</Link>
          </li> */}
          <li
            className={router.pathname == "/my-contracts" ? "active" : ""}
            onClick={props.mobileDrawerFn}
          >
            <Link href='/my-contracts'>My Contracts</Link>
          </li>

          <Tooltip
            title="Coming Soon"
            placement="top"
            enterTouchDelay={0}
            arrow
          >
            <li>
              <Link href="/">
                Earn
              </Link>
            </li>

          </Tooltip>        

          <li className='headerButton hideSmallerThanIpad'>
            <span></span>
            <ConnectWallet
              currentAccount={props.currentAccount}
              setCurrentAccount={props.setCurrentAccount}
            />
          </li>
          <li className='headerButton' onClick={props.mobileDrawerFn}>
            <Button
              link='/create-contract'
              classes={"button secondary withIcon rounded"}
            >
              <i>
                <PlusIc />
              </i>
              <span>Create Contract</span>
            </Button>
          </li>
        </ul>
      </nav>

      <div className='headerActions'>
        <div onClick={props.changeDarkMode} className='modeChange'>
          <span
            style={{
              display: darkMode ? "block" : "none",
            }}
          >
            <MoonIc />
          </span>
          <span
            style={{
              display: darkMode ? "none" : "block",
            }}
          >
            <SunIc />
          </span>
        </div>
        <div className='headerNotification'>
          <div className='notiIc'>
            <NotificationIc 
              onClick={() =>
                {
                  setModelData({
                    show: true,
                    type: "modal",
                    title: "Notifications",
                    body: (
                      <Notifications/>
                    ),
                  })
                  setNotificationsRead(true)
                }
              }
            />
            <div className={notificationsRead ? "" : "notiIndicator"} ></div>
          </div>
        </div>
        <div className='headerUser' ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='headerUserIc'
          >
            <UserProfileIc />
          </div>

          {dropdownOpen && (
            <div className='dropdownMenu right withIc'>
              <ul>
                <li onClick={() => setDropdownOpen(false)}>
                  <Button link={`/user/${currentAccount}`}>
                    <i>
                      <UserIc />
                    </i>
                    <span>My Profile</span>
                  </Button>
                </li>
                <li
                  onClick={props.mobileDrawerFn}
                >
                  <Button link='/messages'>
                    <i>
                      <DisputeIc />
                    </i>
                    <span>Inbox</span>
                  </Button>
                </li>
                {/* <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/contracts-listed'>
                    <i>
                      <ServicesListedIc />
                    </i>
                    <span>Contracts Listed</span>
                  </Button>
                </li> */}
                {/* <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/handle-disputes'>
                    <i>
                      <DisputeIc />
                    </i>
                    <span>Handle Disputes</span>
                  </Button>
                </li> */}
                {/* <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/personalized-contracts'>
                    <i>
                      <PersonlaizedContractsIc />
                    </i>
                    <span>Personalized Contracts</span>
                  </Button>
                </li> */}
                <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/my-contracts'>
                    <i>
                      <AgreementIc />
                    </i>
                    <span>My Contracts</span>
                  </Button>
                </li>
                <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/'>
                    <i>
                      <SettingsIc />
                    </i>
                    <span>Settings</span>
                  </Button>
                </li>
                <li onClick={() => setDropdownOpen(false)}>
                  <Button link='/'>
                    <i>
                      <LogoutIc />
                    </i>
                    <span>Logout</span>
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className={
            hasMenuDrawer ? "mobileNavTrigger show" : "mobileNavTrigger"
          }
        >
          <MobileMenuIc onClick={props.mobileDrawerFn} />
        </div>
      </div>

      <ModalUi
        content={modelData}
        closeModelFn={closeModelDataHandler}
      />
    </header>
  );
}
