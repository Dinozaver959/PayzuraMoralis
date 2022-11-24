// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  console.log("Starting Hardhat scripts/deploy.....");

  //const EscrowFactory = await hre.ethers.getContractFactory("EscrowFactory");
  //const escrowFactory = await EscrowFactory.attach("0x1dbb2E7CE98FD5D5815331A62238A545f97aD81E");

  
  // deploy the contract template
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.deployed();
  console.log(`escrow deployed to: ${escrow.address}`);


  // deploy EscrowFactory
  const EscrowFactory = await hre.ethers.getContractFactory("EscrowFactory");
  const escrowFactory = await EscrowFactory.deploy(escrow.address);
  await escrowFactory.deployed();
  console.log(`escrowFactory deployed to: ${escrowFactory.address}`);
/* */


  //------------------------------------------------------------------------------
  //                  create a seller -> buyer contract (ETH)
  //------------------------------------------------------------------------------


  /*

    await escrowFactory.CreateEscrowSeller(
      ["0xdD870fA1b7C4700F2BD7f44238821C26f7392148", "0x583031D1113aD414F02576BD6afaBfb302140225", "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"], 
      hre.ethers.utils.parseEther("0.001"), 
      "0x0000000000000000000000000000000000000000", 
      1, 
      "a23e5fdcd7b276bdd81aa1a0b7b963101863dd3f61ff57935f8c5ba462681ea6", 
      1784214826, 
      []
    );

    // get index of totalSupply
    let numberOfContracts = await escrowFactory.clonedContractsIndex();
    console.log(`numberOfContracts: ${numberOfContracts}`);

    let addressOfContract0 = await escrowFactory.GetAddress(0);
    console.log(`addressOfContract0: ${addressOfContract0}`);

    // buyer accepts the contract
    await escrowFactory.AcceptOfferBuyer(
      numberOfContracts - 1, 
      { value: hre.ethers.utils.parseEther("0.001") }
    );
    console.log(`Contract Accepted: ${addressOfContract0}`);

    // buyer confirms delivery
    await escrowFactory.ConfirmDelivery(numberOfContracts - 1);
    console.log(`Delivery Confirmed: ${addressOfContract0}`);

  */

  //------------------------------------------------------------------------------
  //                  create a buyer -> seller contract (ETH)
  //------------------------------------------------------------------------------

/*  
  await escrowFactory.CreateEscrowBuyer(
    ["0x976EA74026E726554dB657fA54763abd0C3a0aa9", "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"], 
    1000000000000000, // hre.ethers.utils.parseEther("100"), // 0.001 
    "0x0000000000000000000000000000000000000000", 
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"], // , "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"], //, "0x90F79bf6EB2c4f870365E785982E1f101E93b906"],   // referrals
    0, 
    "a23e5fdcd7b276bdd81aa1a0b7b963101863dd3f61ff57935f8c5ba462681ea6", 
    1784214826, 
    ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0", "0x1591C783EfB2Bf91b348B6b31F2B04De1442836c"],
    { value: 1000000000000000  } // 0.001   hre.ethers.utils.parseEther("100") 
  );


  numberOfContracts = await escrowFactory.clonedContractsIndex();
  console.log(`numberOfContracts: ${numberOfContracts}`);

  let addressOfContract1 = await escrowFactory.GetAddress(numberOfContracts - 1);
  console.log(`addressOfContract1: ${addressOfContract1}`);

  let stateOfContract1 = await escrowFactory.GetState(numberOfContracts - 1);
  console.log(`stateOfContract1: ${stateOfContract1}`);

  let isEligible1 = await escrowFactory.GetIsWalletEligibleToAcceptOffer(numberOfContracts - 1, "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0")
  console.log(`is eligible to accept: ${isEligible1}`);
  let isEligible2 = await escrowFactory.GetIsWalletEligibleToAcceptOffer(numberOfContracts - 1, "0x1591C783EfB2Bf91b348B6b31F2B04De1442836c")
  console.log(`is eligible to accept: ${isEligible2}`);



  // buyer needs to select sellers
  //let sender = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  //console.log(`sender: ${sender}`);
  //await escrowFactory.AddBuyerPersonalizedOffer(numberOfContracts - 1, [sender]);
  //stateOfContract1 = await escrowFactory.GetState(1);
  //console.log(`stateOfContract1: ${stateOfContract1}`);


  // seller accepts the contract
  console.log("about to accept the contract");


  await escrowFactory.AcceptOfferSeller(
    numberOfContracts - 1,
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "0x90F79bf6EB2c4f870365E785982E1f101E93b906"] //["0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0", "0x1591C783EfB2Bf91b348B6b31F2B04De1442836c", "0xfDB177128E6DBc71b7012761984558123CCD5224"]
  );


  console.log("Seller Accepted the contract");
  let stateOfContract2 = await escrowFactory.GetState(numberOfContracts - 1);
  console.log(`stateOfContract1: ${stateOfContract2}`);




  let sellerReferrals = await escrowFactory.GetSellerReferrals(numberOfContracts - 1);
  console.log(`sellerReferrals: ${sellerReferrals}`);

  let buyerReferrals = await escrowFactory.GetBuyerReferrals(numberOfContracts - 1);
  console.log(`buyerReferrals: ${buyerReferrals}`);


  // buyer confirms delivery
  await escrowFactory.ConfirmDelivery(numberOfContracts - 1);
  console.log("Buyer confirmed the delivery");
  let stateOfContract3 = await escrowFactory.GetState(numberOfContracts - 1);
  console.log(`stateOfContract1: ${stateOfContract3}`);

*/



  /*
  // get balances of local accounts
  const accounts = await hre.ethers.getSigners();
  const provider = hre.ethers.provider;

  for (const account of accounts) {
    console.log(
      "%s (%i ETH)",
      account.address,
      //hre.ethers.utils.formatEther(
        // getBalance returns wei amount, format to ETH amount
        await provider.getBalance(account.address)
      //)
    );
  }
  */

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// npm init -y
// npm install --save-dev hardhat
// npm i @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan 
// npm i @openzeppelin/contracts @openzeppelin/contracts-upgradeable
// optional for testing:    npm i -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
// npx hardhat

// https://hardhat.org/hardhat-runner/docs/getting-started#overview

// npx hardhat compile (automatic on run script/deploy.js)
// npx hardhat run --network mumbai scripts/deploy.js
// npx hardhat verify --network matic 0xB9dE927100AA625B75Ac05FF907555a1Aec61F41
// to start a local node:   npx hardhat node   (localhost network)
// run on local node: npx hardhat run --network localhost scripts/deploy.js
// run quick in memory and delete (only console.log will be visible): npx hardhat run scripts/deploy.js
