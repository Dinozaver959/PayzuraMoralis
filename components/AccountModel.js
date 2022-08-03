import Link from "next/link";
import Button from "./ui/Button";

function AccountModel(props) {
  return (
    <div className='connectedAccount'>
      <div className='accountBlock'>
        <div className='blockTop'>
          <div className='connectedWith'>Connected with MetaMask</div>
          <div className='connectedActions'>
            <Button>Disconnect</Button>
            <Button>Change</Button>
          </div>
        </div>
        <div className='walletAddress'>
          <div className='walletPic'></div>
          <div className='walletID'>{props.sortAddress}</div>
        </div>
        <div className='walletActions'>
          <Button>Copy Address</Button>
          <Link
            href={"https://polygonscan.com/address/" + props.currentAccount}
            passHref
          >
            <a
              target='_blank'
              rel='noopener noreferrer'
              // className='button green rounded'
            >
              View on Explorer
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountModel;
