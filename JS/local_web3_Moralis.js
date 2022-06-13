import Moralis from "moralis"
import {ABI} from "./ABI.js"

//const ethers = Moralis.web3Library;
 
const FactoryContractAddress = "0x5D023afC16961d44E5fB3F29fe17fd54cE8D3487";



// READ Functions

export async function clonedContractsIndex_Moralis_indexPage() {

    const numberOfAgreements = await MoralisRead("clonedContractsIndex");
 
    console.log("numberOfAgreements: " + numberOfAgreements);
    document.getElementById('clonedContractsIndex_Display').innerText = numberOfAgreements;
    document.getElementById('clonedContractsIndex_Display').style.visibility = "visible";
}

export async function clonedContractsIndex_Moralis() {

    const numberOfAgreements = await MoralisRead("clonedContractsIndex");
    console.log("numberOfAgreements: " + numberOfAgreements);
    return numberOfAgreements;
}

export async function GetAddress_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const address = await MoralisRead("GetAddress", params); // will give an array with a hex value
 
    console.log("address: " + address);
    document.getElementById('GetAddress_Display').innerText = address;
    document.getElementById('GetAddress_Display').style.visibility = "visible";
}

export async function GetBalance_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const balance_hex = await MoralisRead("GetBalance", params); // will give an array with a hex value
    const balance = parseInt(balance_hex['_hex'], 16);

    console.log("balance: " + balance);
    document.getElementById('GetBalance_Display').innerText = balance;
    document.getElementById('GetBalance_Display').style.visibility = "visible";
}

export async function GetTimeLeftToDeadline_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const timeLeftToDeadline = await MoralisRead("GetTimeLeftToDeadline", params); // will give an array with a hex value
    console.log("timeLeftToDeadline: " + timeLeftToDeadline);
    document.getElementById('GetTimeLeftToDeadline_Display').innerText = timeLeftToDeadline;
    document.getElementById('GetTimeLeftToDeadline_Display').style.visibility = "visible";
}

export async function GetArbiter_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const arbiter = await MoralisRead("GetArbiter", params); // will give an array with a hex value
    console.log("arbiter: " + arbiter);
    document.getElementById('GetArbiter_Display').innerText = arbiter;
    document.getElementById('GetArbiter_Display').style.visibility = "visible";
}

export async function GetBuyer_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const buyer = await MoralisRead("GetBuyer", params); // will give an array with a hex value
    console.log("buyer: " + buyer);
    document.getElementById('GetBuyer_Display').innerText = buyer;
    document.getElementById('GetBuyer_Display').style.visibility = "visible";
}

export async function GetSeller_Moralis() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    const seller = await MoralisRead("GetSeller", params); // will give an array with a hex value
    console.log("seller: " + seller);
    document.getElementById('GetSeller_Display').innerText = seller;
    document.getElementById('GetSeller_Display').style.visibility = "visible";
}

export async function GetState_Moralis() {
    // add a check for correct network

    const index = GetIndex();

    const params = {
        index: index,
    }

    const state = await MoralisRead("GetState", params); // will give an array with a hex value
    console.log("state: " + state);
    document.getElementById('GetState_Display').innerText = state;
    document.getElementById('GetState_Display').style.visibility = "visible";
}

export async function GetPrice_Moralis_indexPage() {
    // add a check for correct network

    const index = GetIndex();

    const params = {
        index: index,
    }

    const price = await MoralisRead("GetPrice", params); // will give an array with a hex value
    console.log("price: " + price);
    document.getElementById('GetPrice_Display').innerText = price;
    document.getElementById('GetPrice_Display').style.visibility = "visible";

    return price;
}

export async function GetPrice_Moralis(index) {

    const params = {
        index: index,
    }

    const price = await MoralisRead("GetPrice", params); // will give an array with a hex value
    console.log("price: " + price);

    return price;
}

export async function GetDeadline_Moralis() {
    // add a check for correct network

    const index = GetIndex();

    const params = {
        index: index,
    }

    const deadline = await MoralisRead("GetDeadline", params); // will give an array with a hex value
    console.log("deadline: " + deadline);
    document.getElementById('GetDeadline_Display').innerText = deadline;
    document.getElementById('GetDeadline_Display').style.visibility = "visible";
}

export async function GetHashOfDescription_Moralis() {
    // add a check for correct network

    const index = GetIndex();

    const params = {
        index: index,
    }

    const hashOfDescription = await MoralisRead("GetHashOfDescription", params); // will give an array with a hex value
    console.log("hashOfDescription: " + hashOfDescription);
    document.getElementById('GetHashOfDescription_Display').innerText = hashOfDescription;
    document.getElementById('GetHashOfDescription_Display').style.visibility = "visible";
}

export async function GetGracePeriod_Moralis() {
    // add a check for correct network

    const index = GetIndex();

    const params = {
        index: index,
    }

    const gracePeriod = await MoralisRead("GetGracePeriod", params); // will give an array with a hex value
    console.log("gracePeriod: " + gracePeriod);
    document.getElementById('GetGracePeriod_Display').innerText = gracePeriod;
    document.getElementById('GetGracePeriod_Display').style.visibility = "visible";
}
 
async function MoralisRead(method, params) {
  
    // have it hard coded for now - all testing and MVP are going to be done on Rinkeby!
    await HandleNetworkSwitch("rinkeby"); 

    // <-- this is needed if there was no authentication - good for read only
    await Moralis.enableWeb3();
  
    console.log("method: " + method);
  
    const readOptions = {
      contractAddress: FactoryContractAddress,
      functionName: method,
      abi: ABI,
      params: params
    };
  
    const message = await Moralis.executeFunction(readOptions);
    return message;
}





// WRITE Functions

export async function CreateEscrow_Moralis_indexPage() {

    // 10000000000,1,a23e5fdcd7b276bdd81aa1a0b7b963101863dd3f61ff57935f8c5ba462681ea6
    const input = document.getElementById('CreateEscrow_Input').value.split(",");
    const price = input[0];
    const timeToDeliver = input[1]; 
    const hashOfDescription = input[2];

    const params = {
        price: price,
        timeToDeliver: timeToDeliver,
        hashOfDescription: hashOfDescription,
    }
  
    return await MoralisWrite_("CreateEscrow", params);
}

export async function AcceptOffer_Moralis_indexPage() {

    const index = GetIndex();

    // get the mint price
    const price = await GetPrice_Moralis(index); // will give an array with a hex value
    console.log("price: " + price);
    
    const params = {
        index: index,
    }

    return await MoralisWrite__("AcceptOffer", params, price); // price * 
}

export async function ReturnPayment_Moralis_indexPage() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    await MoralisWrite__("ReturnPayment", params);
}

export async function ClaimFunds_Moralis_indexPage() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    await MoralisWrite__("ClaimFunds", params);
}

export async function StartDispute_Moralis_indexPage() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    await MoralisWrite__("StartDispute", params);
}

export async function ConfirmDelivery_Moralis_indexPage() {

    const index = GetIndex();

    const params = {
        index: index,
    }

    await MoralisWrite__("ConfirmDelivery", params);
}



export async function CreateEscrow_Moralis(price, timeToDeliver, hashOfDescription, offerValidUntil, personalizedOffer) {

    console.log("offerValidUntil:");
    console.log(offerValidUntil);


    var personalizedOffer_parts = personalizedOffer.split(",");

    if(!personalizedOffer){
        personalizedOffer_parts = [];
    }


    const params = {
        price: price,
        timeToDeliver: timeToDeliver,
        hashOfDescription: hashOfDescription,
        offerValidUntil: offerValidUntil,       //offerValidFor: offerValidFor,
        personalizedOffer: personalizedOffer_parts
    }
  
    return await MoralisWrite_("CreateEscrow", params);
}

export async function AcceptOffer_Moralis(index) {

    // get the mint price
    const price = await GetPrice_Moralis(index); // will give an array with a hex value
    
    console.log("price: " + price);
    console.log("index: " + index);
    
    const params = {
        index: index,
    }

    return await MoralisWrite__("AcceptOffer", params, price); //    2000000000000000
}

export async function ReturnPayment_Moralis(index) {

    const params = {
        index: index,
    }

    await MoralisWrite__("ReturnPayment", params);
}

export async function ClaimFunds_Moralis(index) {

    const params = {
        index: index,
    }

    await MoralisWrite__("ClaimFunds", params);
}

export async function StartDispute_Moralis(index) {

    const params = {
        index: index,
    }

    await MoralisWrite__("StartDispute", params);
}

export async function ConfirmDelivery_Moralis(index) {

    const params = {
        index: index,
    }

    await MoralisWrite__("ConfirmDelivery", params);
}



export async function HandleDispute_Moralis(returnFundsToBuyer) {

    const index = GetIndex();

    const params = {
        index: index,
        returnFundsToBuyer: returnFundsToBuyer,
    }

    await MoralisWrite__("HandleDispute", params);
}

async function MoralisWrite(method) {
    return await MoralisWrite_(method, {});
}
  
async function MoralisWrite_(method, params) {
    return await MoralisWrite__(method, params, 0);
}
  
async function MoralisWrite__(method, params, value) {

    // have it hard coded for now - all testing and MVP are going to be done on Rinkeby!
    await HandleNetworkSwitch("rinkeby"); 

    await Moralis.enableWeb3();


    console.log("value/price: " + value)
  
    // <-- this is needed if there was no authentication - good for read only
    //const web3Provider = await Moralis.enableWeb3();
  
    console.log("method: " + method);
  
    const writeOptions = {
      contractAddress: FactoryContractAddress,
      functionName: method,
      abi: ABI,
      params: params,
      msgValue: value
    };
  
    const transaction = await Moralis.executeFunction(writeOptions);
  
    // need to check if Tx was rejected or if something else went wrong (on success we can return the Tx hash -> which we could store in DB)
  
  
    console.log("transaction hash: " + transaction.hash);
  
    await transaction.wait();
    console.log("transaction is confirmed");


    return transaction.hash;
}



// AUX Functions

function GetIndex(){
    return document.getElementById('Contract_Index').value;
}

export async function GetWallet_NonMoralis(){
    if (window.ethereum) {
      try {
        const connectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("connectedAddress: " + connectedAddress)
        return connectedAddress
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          console.log('user denied request');
        }
        console.log('error: ' + error);
      }
    }
}


async function HandleNetworkSwitch(networkName) {

    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");

        if (window.ethereum.networkVersion !== ConvertNetworkNameToChainID(networkName)) {

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: "0x" + (ConvertNetworkNameToChainID(networkName)).toString(16) }]
                });

            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                        {
                            ...networks[networkName]
                        }]
                    });
                }
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}
  
function ConvertNetworkNameToChainID(networkName){
  
    switch (networkName) {
        case "homestead":
            return 1;

        case "ropsten":
            return 3;

        case "rinkeby":
            return 4;

        case "goerli":
            return 5;

        case "kovan":
            return 42;

        case "polygon":
            return 137;

        case "mumbai":
            return 80001;

        case "bsc":
            return 56;

        case "bsct":
            return 97;

        default:
            break;
    }
}
  
const networks = {

    homestead: {
        chainId: `0x${Number(1).toString(16)}`,
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
        },
        rpcUrls: ["https://api.mycryptoapi.com/eth/"],
        blockExplorerUrls: ["https://etherscan.io/"]
    },
    ropsten: {
        chainId: `0x${Number(3).toString(16)}`,
        chainName: "Test Network Ropsten",
        nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
        },
        rpcUrls: ["https://ropsten.infura.io/v3/"],
        blockExplorerUrls: ["https://ropsten.etherscan.io/"]
    },
    rinkeby: {
        chainId: `0x${Number(4).toString(16)}`,
        chainName: "Test Network Rinkeby",
        nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
        },
        rpcUrls: ["https://rinkeby.infura.io/v3/"],
        blockExplorerUrls: ["https://rinkeby.etherscan.io/"]
    },
    goerli: {
        chainId: `0x${Number(5).toString(16)}`,
        chainName: "Test Network Goerli",
        nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
        },
        rpcUrls: ["https://goerli.infura.io/v3/"],
        blockExplorerUrls: ["https://goerli.etherscan.io/"]
    },
    kovan: {
        chainId: `0x${Number(42).toString(16)}`,
        chainName: "Test Network Kovan",
        nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
        },
        rpcUrls: ["https://kovan.infura.io/v3/"],
        blockExplorerUrls: ["https://kovan.etherscan.io/"]
    },
    bsct: {
        chainId: `0x${Number(97).toString(16)}`,
        chainName: "Binance Smart Chain Testnet",
        nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        blockExplorerUrls: ["https://testnet.bscscan.com/"]
    },
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"]
    },
    polygon_Mumbai: {
        chainId: `0x${Number(80001).toString(16)}`,
        chainName: "Mumbai",
        nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
        },
        rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
    },
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "BNB",
        decimals: 18
        },
        rpcUrls: [
        "https://bsc-dataseed1.binance.org",
        "https://bsc-dataseed2.binance.org",
        "https://bsc-dataseed3.binance.org",
        "https://bsc-dataseed4.binance.org",
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed2.defibit.io",
        "https://bsc-dataseed3.defibit.io",
        "https://bsc-dataseed4.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        "https://bsc-dataseed2.ninicoin.io",
        "https://bsc-dataseed3.ninicoin.io",
        "https://bsc-dataseed4.ninicoin.io",
        "wss://bsc-ws-node.nariox.org"
        ],
        blockExplorerUrls: ["https://bscscan.com"]
    }
};