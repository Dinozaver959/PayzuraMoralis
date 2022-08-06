import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "./ui/Button";

import LinkExplorerIc from "./icons/Explorer";
import CircleCheckIc from "./icons/CircleCheck";

function AccountModel(props) {
  // const textToCopy = props.currentAccount;
  // const CC = dynamic(
  //   () =>
  //     import("./icons/copy-clipboard").then((mod) => mod.CopyClipboard),
  //   { ssr: false }
  // );

  return (
    <div className="connectedAccount">
      <div className="accountBlock">
        <div className="blockTop">
          <div className="connectedWith">Connected with MetaMask</div>
          <div className="connectedActions">
            <Button>Disconnect</Button>
            <Button>Change</Button>
          </div>
        </div>
        <div className="walletAddress">
          <div className="walletPic">
            <i></i>
          </div>
          <div className="walletID">{props.sortAddress}</div>
        </div>
        <div className="walletActions">
          <Button>
            <i>
              <CircleCheckIc />
            </i>
            <span>Copy Address</span>
          </Button>
          {/* <CC content={textToCopy} /> */}
          <Link
            href={"https://polygonscan.com/address/" + props.currentAccount}
            passHref
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              // className='button green rounded'
            >
              <i>
                <LinkExplorerIc size={18} />
              </i>
              View on Explorer
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountModel;
