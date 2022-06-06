import Login from "./Login";
import { useMoralis } from "react-moralis";

const Authenticate = ({children}) => {
    const {isAuthenticated} = useMoralis();
    return (
        <> 
            {
                isAuthenticated ? (
                    <>
                        {children} 

                    </>
                ) : (
                    <Login />
                )
                }
        </>
    );
}

export default Authenticate;