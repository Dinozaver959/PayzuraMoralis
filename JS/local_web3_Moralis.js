import Moralis from "moralis"
import {ABI, ABI_ERC20} from "./ABI.js"
import {constants} from "ethers";

//const ethers = Moralis.web3Library;
 
const FactoryContractAddress = "0x5231b92923c15439989742048fbF6D274cf415A0"; // "0xC580C23A982C11A3812920C51EDd104B2BB89B15"; // "0x6526447628924eea4F0578e812826f327F8d489B"; //"0x5Fc12E3eC96dd2F008DB5f32497cbAbefB049B60";   // 0x5D023afC16961d44E5fB3F29fe17fd54cE8D3487 - checked in
export const contractOnNetwork = "polygon";
const commission = 0.01;
export const PayzuraCentealizedArbiter = "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0"; // Payzura Team/Platform address


// for a test
const Web3 = require('web3');





// READ Functions

export async function clonedContractsIndex_Moralis() {

    const numberOfAgreements = await MoralisRead("clonedContractsIndex");
    console.log("numberOfAgreements: " + numberOfAgreements);
    return numberOfAgreements;
}

export async function GetPrice_Moralis(index) {

    const params = {
        index: index,
    }

    const price = await MoralisRead("GetPrice", params); // will give an array with a hex value
    console.log("price: " + price);

    return price;
}

export async function GetAddress_Moralis(index) {

    const params = {
        index: index,
    }

    const address = await MoralisRead("GetAddress", params);
    console.log("address: " + address);

    return address;
}

// --------------------------------------------------------------------------------------------------------------------------------
// were only used for the initial index page (commenting out for now), as some might be used later
// --------------------------------------------------------------------------------------------------------------------------------
/*
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
*/
//--------------------------------------------------------------------------------------------------------------------------------
 
async function MoralisRead(method, params) {
  
    await HandleNetworkSwitch(contractOnNetwork); 

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

export async function CreateEscrow_Moralis(isBuyer, userWallet, price, currencyTicker, timeToDeliver, hashOfDescription, offerValidUntil, personalizedOffer, arbiters) {

    var personalizedOffer_parts = personalizedOffer.split(",");

    if(!personalizedOffer){
        personalizedOffer_parts = [];
    }

    var arbiters_parts = arbiters.split(",");

    if(!arbiters){
        arbiters_parts = [PayzuraCentealizedArbiter];
    }

    for (let i = 0; i < personalizedOffer_parts.length; i++){
        console.log("personalizedOffer_parts[i]: " + personalizedOffer_parts[i])
    }
    for (let i = 0; i < arbiters_parts.length; i++){
        console.log("arbiters_parts[i]: " + arbiters_parts[i])
    }

    // for ETH
    // const price_ = BigInt(10 ** 14) * BigInt((10 ** 4) * price);
    // for USDC
    // const price_ = BigInt((10 ** 6) * price);

    var price_;
    const numberOfDecimals = CurrencyTickerToDecimals(currencyTicker);

    // this approach is needed because we can only fit an integer
    if(numberOfDecimals <= 14){ 
        price_ = BigInt((10 ** numberOfDecimals) * price);
    } else {
        price_ = BigInt(10 ** 14) * BigInt((10 ** (numberOfDecimals - 14)) * price);
    }

    const tokenContractAddress = CurrencyTickerToAddress(currencyTicker, ConvertNetworkNameToChainID(contractOnNetwork)); // note for now we are forcing the use of polygon

    const params = {
        arbiters: arbiters_parts,
        price: price_.toString(),
        tokenContractAddress: tokenContractAddress,
        timeToDeliver: timeToDeliver,
        hashOfDescription: hashOfDescription,
        offerValidUntil: offerValidUntil, 
        personalizedOffer: personalizedOffer_parts,
    }

    console.log("isBuyer ", isBuyer);

    if(isBuyer && currencyTicker == "ETH") {
        return await MoralisWrite__("CreateEscrowBuyer", params, price_.toString());
    } else if(isBuyer){

        // check if seller has given the EscrowFactory approval for ERC20 transfer
        await ApproveERC20_UNLIMITED_Moralis(price_.toString(), userWallet);  // USDC on Matic hardcoded at the moment
        
        return await MoralisWrite_("CreateEscrowBuyer", params);
    }
    else {
        return await MoralisWrite_("CreateEscrowSeller", params);
    }
}

export async function AcceptOfferBuyer_Moralis(index, CurrencyTicker, userWallet) {

    // get the mint price
    var price = await GetPrice_Moralis(index); // will give an array with a hex value
    // price = BigInt(price);
    
    console.log("price: " + price);
    console.log("index: " + index);
    console.log("CurrencyTicker ", CurrencyTicker);
    
    const params = {                                                                                                        // do we not need the price????
        index: index,
    }

    // org - works fine with ethereum
    if (CurrencyTicker == "ETH"){
        return await MoralisWrite__("AcceptOfferBuyer", params, price); // for ETH
    } else {


        // check for the approval first 
        await ApproveERC20_UNLIMITED_Moralis(price, userWallet);

        return await MoralisWrite__("AcceptOfferBuyer", params, 0); // for USDC 
    }

    //return await MoralisWrite_("AcceptOffer", params);
}

export async function AcceptOfferSeller_Moralis(index) {

    console.log("index: " + index);

    const params = {                                                                                                        // do we not need the price????
        index: index,
    }

    return await MoralisWrite_("AcceptOfferSeller", params);
}

export async function FundContract_Moralis(index) {

    console.log("index: " + index);

    const params = {                                                                                                        // do we not need the price????
        index: index,
    }

    return await MoralisWrite_("FundContract", params);
}

export async function CancelSellerContract_Moralis(index) {

    console.log("index: " + index);

    const params = {                                                                                                        // do we not need the price????
        index: index,
    }

    return await MoralisWrite_("CancelSellerContract", params);
}

export async function CancelBuyerContract_Moralis(index) {

    console.log("index: " + index);

    const params = {                                                                                                        // do we not need the price????
        index: index,
    }

    return await MoralisWrite_("CancelBuyerContract", params);
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

export async function UpdateDelegates_Moralis(index, isBuyer, delegatesToAdd, delegatesToRemove){

    var delegatesToAdd_parts = delegatesToAdd.split(",");
    if(!delegatesToAdd){
        delegatesToAdd_parts = [];
    }

    var delegatesToRemove_parts = delegatesToRemove.split(",");
    if(!delegatesToRemove){
        delegatesToRemove_parts = [];
    }

    const params = {
        index: index,
        delegatesToAdd: delegatesToAdd_parts,
        delegatesToRemove: delegatesToRemove_parts,
    }


    if(isBuyer){
        return await MoralisWrite__("UpdateBuyerDelegates", params);
    } else {
        return await MoralisWrite__("UpdateSellerDelegates", params);
    }
}

export async function UpdatePersonalizedOffer_Moralis(index, isBuyer, personalizedToAdd, personalizedToRemove){

    var personalizedToAdd_parts = personalizedToAdd.split(",");
    if(!personalizedToAdd){
        personalizedToAdd_parts = [];
    }

    var personalizedToRemove_parts = personalizedToRemove.split(",");
    if(!personalizedToRemove){
        personalizedToRemove_parts = [];
    }

    const params = {
        index: index,
        personalizedOfferToAdd: personalizedToAdd_parts,
        personalizedOfferToRemove: personalizedToRemove_parts,
    }


    if(isBuyer){
        return await MoralisWrite__("UpdateBuyerPersonalizedOffer", params);
    } else {
        return await MoralisWrite__("UpdateSellerPersonalizedOffer", params);
    }
}

export async function HandleDispute_Moralis(index, returnFundsToBuyer) {

    const params = {
        index: index,
        returnFundsToBuyer: returnFundsToBuyer,
    }

    console.log(params);

    //const web3 = await Moralis.enableWeb3();
    return await MoralisWrite__("HandleDispute", params);                                                          // possible add 'return'  
}




async function MoralisWrite(method) {
    return await MoralisWrite_(method, {});
}
  
async function MoralisWrite_(method, params) {
    return await MoralisWrite__(method, params, 0);
}
  
async function MoralisWrite__(method, params, value) {

    await HandleNetworkSwitch(contractOnNetwork); 

    await Moralis.enableWeb3();

    console.log("value/price: " + value)
  
    // <-- this is needed if there was no authentication - good for read only
    //const web3Provider = await Moralis.enableWeb3();
  
    console.log("method: " + method);
    console.log("params: " + JSON. stringify(params));
  
    const writeOptions = {
      contractAddress: FactoryContractAddress,
      functionName: method,
      abi: ABI,
      params: params,
      msgValue: value
    };

    var transaction = await Moralis.executeFunction(writeOptions);

    // need to check if Tx was rejected or if something else went wrong (on success we can return the Tx hash -> which we could store in DB)
    console.log("transaction hash: " + transaction.hash);

    var tx;

  try {
    tx = await transaction.wait();
    // myProcessMinedTransaction(transaction, receipt);
  } catch(error) {
    if (error.code === Logger.errors.TRANSACTION_REPLACED) {
      if (error.cancelled) {
        // The transaction was replaced  :'(
        //myProcessCancelledTransaction(transaction, error.replacement);
      } else {
        // The user used "speed up" or something similar
        // in their client, but we now have the updated info
        // myProcessMinedTransaction(error.replacement, error.receipt);
        transaction = error.replacement;
      }
    }
  }

    console.log("transaction is confirmed");

    if(method == "HandleDispute"){

        console.log("tx.events: " + JSON.stringify(tx.events));
        console.log("tx.events[3].event: " + JSON.stringify(tx.events[3].event)); // if = ArbitersVoteConcluded

        if(tx.events[3].event && tx.events[3].event == "DisputeClosed")  // "ArbitersVoteConcluded"
        {
            console.log("ArbitersVoteConcluded = true");
            //return {"transactionHash" : transaction.hash, "ArbitersVoteConcluded" : "true"};
            return "true";
        }
   
        //return {"transactionHash" : transaction.hash, "ArbitersVoteConcluded" : "false"};
        return "false";
    }

    return transaction.hash;
}

// approve the escrow contract instance
export async function ApproveERC20_Moralis(index){

    const ERC20_contractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";


    await HandleNetworkSwitch(contractOnNetwork); 
    await Moralis.enableWeb3();

    console.log("index: " + index);
    const address = await GetAddress_Moralis(index);
    console.log("address: " + address);

    var price = await GetPrice_Moralis(index); // will give an array with a hex value
    price = BigInt(price);
    console.log("price: " + price);

    const params = {
        _spender: address, // contract address of this instance              // ORG: for the instance of escrow contract
        //_spender: FactoryContractAddress,
        _value: price,
    }

    const writeOptions = {
        contractAddress: ERC20_contractAddress,
        functionName: "approve",
        abi: ABI_ERC20,
        params: params,
        msgValue: 0
    };

    var transaction = await Moralis.executeFunction(writeOptions);

    console.log("transaction hash: " + transaction.hash);
  
    var tx;

    try {
      tx = await transaction.wait();
      // myProcessMinedTransaction(transaction, receipt);
    } catch(error) {
      if (error.code === Logger.errors.TRANSACTION_REPLACED) {
        if (error.cancelled) {
          // The transaction was replaced  :'(
          //myProcessCancelledTransaction(transaction, error.replacement);
        } else {
          // The user used "speed up" or something similar
          // in their client, but we now have the updated info
          // myProcessMinedTransaction(error.replacement, error.receipt);
          transaction = error.replacement;
        }
      }
    }

    console.log("transaction is confirmed");

    return transaction.hash;
}

// approve the FactoryEscrow contract
export async function ApproveERC20_UNLIMITED_Moralis(price, userWallet){

  const ERC20_contractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  await HandleNetworkSwitch(contractOnNetwork); 
  await Moralis.enableWeb3();


  // check if allowance is enough
  console.log("userWallet", userWallet);
  console.log(userWallet);
  //console.log(userWallet[0]);
  const ret = await Check_ERC20_Approval_Moralis(price, userWallet);
  console.log(ret); // true/false

  if(ret){
    console.log("allowance is enough");
    return true;
  }
  console.log("allowance is not enough");

  const params = {
    _spender: FactoryContractAddress, // contract address of this instance              // ORG: for the instance of escrow contract
    _value: constants.MaxInt256,
  }

  const writeOptions = {
    contractAddress: ERC20_contractAddress,
    functionName: "approve",
    abi: ABI_ERC20,
    params: params,
    msgValue: 0
  };

  var transaction = await Moralis.executeFunction(writeOptions);

  console.log("transaction hash: " + transaction.hash);

  var tx;

  try {
    tx = await transaction.wait();
    // myProcessMinedTransaction(transaction, receipt);
  } catch(error) {
    if (error.code === Logger.errors.TRANSACTION_REPLACED) {
      if (error.cancelled) {
        // The transaction was replaced  :'(
        //myProcessCancelledTransaction(transaction, error.replacement);
      } else {
        // The user used "speed up" or something similar
        // in their client, but we now have the updated info
        // myProcessMinedTransaction(error.replacement, error.receipt);
        transaction = error.replacement;
      }
    }
  }
  
  console.log("transaction is confirmed");

  return transaction.hash;
}


// approve the FactoryEscrow contract
export async function Check_ERC20_Approval_Moralis(price, userWallet){

  const ERC20_contractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  const params = {
    _owner: userWallet,
    _spender: FactoryContractAddress, // contract address of this instance              // ORG: for the instance of escrow contract  
  }

  const readOptions = {
    contractAddress: ERC20_contractAddress,
    functionName: "allowance",
    abi: ABI_ERC20,
    params: params
  };

  const message = await Moralis.executeFunction(readOptions);
  console.log("allowance:");
  console.log(message);

  price = BigInt(price);
  console.log("price: ", price);

  return (message < price) ? false : true;
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


/* */
export function GetChainID_NonMoralis(){
    if (window.ethereum) {
      try {
        console.log("window.ethereum.networkVersion: " + window.ethereum.networkVersion)
        return window.ethereum.networkVersion
      } catch (error) {
        if (error.code === 4001) {
          console.log('something went wrong');
        }
        console.log('error: ' + error);
      }
    }
}


export function CurrencyTickerToDecimals(currencyTicker){

    // test only
    console.log("test:")
    console.log("chain id: " + GetChainID_NonMoralis());


    switch(currencyTicker){
    
        case "USDC":
            return 6;

        case "ETH":
        default:
            return 18;
    }
}


// should be recoded in the future in better way
export function CurrencyTickerToAddress(currencyTicker, chainId){

    switch(chainId){

        // mainnet
        case 1: 

            switch(currencyTicker){

                case "USDC":
                    return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

                case "ETH":
                default:
                    return "0x0000000000000000000000000000000000000000"; 
            }

        // polygon
        default:
        case 137:
            
            switch(currencyTicker){

                case "USDC":
                    return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

                case "ETH":
                default:
                    return "0x0000000000000000000000000000000000000000"; 
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
  
export function ConvertNetworkNameToChainID(networkName){
  
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