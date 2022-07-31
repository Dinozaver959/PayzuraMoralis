// npm i -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
// npm i @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-etherscan

const {expect} = require('chai');
//const { ethers } = require('ethers');
const hre = require("hardhat");

describe('EscrowFactory', () => {
    let EscrowFactory, escrowFactory, owner, addr1, addr2;

    beforeEach(async () => {
        EscrowFactory = await hre.ethers.getContractFactory("EscrowFactory");
        escrowFactory = await EscrowFactory.deploy();
        [owner, addr1, addr2, _] = await escrowFactory.getSigners();
    });

    describe("Deployment", async () => {
        it("should set the right owner", async () => {
            expect(await escrowFactory.owner().to.equal(owner.address));
        });
    });

    describe("Contract Test", async() => {

        // expect(await someContract.someOtherFunction()).to.equal(somethingOtherThing);
        await escrowFactory.CreateEscrowSeller(
            ["0xdD870fA1b7C4700F2BD7f44238821C26f7392148", "0x583031D1113aD414F02576BD6afaBfb302140225", "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"], 
            100000000000000000, 
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 
            1, 
            a23e5fdcd7b276bdd81aa1a0b7b963101863dd3f61ff57935f8c5ba462681ea6, 
            1784214826, 
            []
        );

        // get index of totalSupply
        let numberOfContracts = await escrowFactory.clonedContractsIndex();
        console.log(`numberOfContracts: ${numberOfContracts}`);

        let addressOfContract0 = await escrowFactory.GetAddress(0);
        console.log(`addressOfContract0: ${addressOfContract0}`);
        


        // await escrowFactory.AcceptOfferBuyer(numberOfContracts - 1);

    })

});