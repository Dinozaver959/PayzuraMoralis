import Image from "next/image";
import icon from "../components/images/metamask.webp"; 
import {useMoralis} from "react-moralis";

function Login() {
    const {authenticate, authError, account} = useMoralis();     // add: web3 - read on it
    return (
        <div className="loginWrapper">
            <div className="card">

                <div className="loginIcon">
                    <Image src={icon} width={72} height={72} alt="" /> {/** width={50} height={50} */}
                </div>

                <button className="button rounded primary" onClick={authenticate}>Login with Moralis </button>
                {
                    authError && (
                        <p className="error">
                            {authError.name}
                            {authError.message}
                        </p>
                    )
                }
            </div>
        </div>
    )
}

export default Login