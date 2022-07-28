// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ReentrancyGuard.sol";
import "./IERC20.sol";
//import "../node_modules/hardhat/console.sol";

contract Escrow is ReentrancyGuard {

    address payable public seller;
    uint256 public price;
    address public tokenContractAddress;   // address(0) -> ETH, other currencies have their contracts

    uint256 public deadline;
    uint256 public timeToDeliver;
    uint256 public offerValidUntil;
    string public hashOfDescription;
    //uint256 public immutable gracePeriod = 86400;   // 24h
    uint256 public immutable gracePeriod = 0;

    uint256 public immutable commision = 10; // 1000 = 100%
    address public immutable payzuraWallet = 0x1591C783EfB2Bf91b348B6b31F2B04De1442836c;
    
    address payable public buyer;
    address[] public arbiters;
    mapping(address => uint256) arbitersVote;

    mapping(address => bool) buyerDelegates;
    mapping(address => bool) sellerDelegates;


    address payable public FactoryAddress;

    mapping(address => bool) personalizedOffer;
    uint256 personalizedOfferCounter;
    enum State { await_payment, buyer_initialized, buyer_initialized_and_paid, await_seller_accepts, paid, dispute, complete, canceled }
    // need to update the naming:
    /*
        await_payment               - seller started the contract, no buyer has paid/accepted yet
        buyer_initialized           - buyer just initialized the contract
        buyer_initialized_and_paid  - buyer had initialized and paid
        await_seller_accepts        - buyer has updated the list of personalizedOffer for potential sellers
        paid                        - contract has been signed by both parties
        dispute                     - contract has entered the dispute
        complete                    - contract is complete (either the service was delivered and acknowledge or a dispute has ended)    
     */
    State public state;
      
    event TransferSent(address _from, address _destAddr, uint _amount);
    event TransferReceived(address _from, uint _amount);


    // --------------------------------------
    //             MODIFIERS
    // --------------------------------------

    modifier instate(State expected_state){
        require(state == expected_state);
        _;
    }

    modifier inEitherStates(State one, State two){
        require(state == one || state == two);
        _;
    }

    modifier inEitherStates3(State one, State two, State three){
        require(state == one || state == two || state == three);
        _;        
    }
  
    modifier onlyBuyer(address _buyer){
        require(msg.sender == FactoryAddress);
        require(_buyer == buyer, "address is not a buyer");
        _;
    }

    modifier onlyBuyerOrDelegate(address _buyer){
        require(msg.sender == FactoryAddress);
        require(_buyer == buyer || buyerDelegates[_buyer], "address is not a delegate or a buyer");
        _;
    }
  
    modifier onlySeller(address _seller){
        require(msg.sender == FactoryAddress);
        require(_seller == seller, "address is not a seller");
        _;
    }

    modifier onlySellerOrDelegate(address _seller){
        require(msg.sender == FactoryAddress);
        require(_seller == seller || sellerDelegates[_seller], "address is not a delegate or a seller");
        _;
    }

    modifier onlyArbiters(address _arbiter){
        require(msg.sender == FactoryAddress);
        require(IsArbiter(_arbiter), "address is not an arbiter");
        _;
    }

  
    // --------------------------------------
    //             CONSTRUCTOR
    // --------------------------------------

    constructor(){} // not sure if needed

    function InitializeSeller (  
        address payable _FactoryAddress,
        address payable _seller,
        address[] calldata _arbiters, 
        uint256 _price,
        address _tokenContractAddress,
        uint256 _timeAllowedInHours,
        string memory _hashOfDescription,       // calldata?
        uint256 _offerValidUntil,
        address[] calldata _personalizedOffer
        
        ) public {

        FactoryAddress = _FactoryAddress;
        state = State.await_payment;
        seller = _seller;
        price = _price;
        tokenContractAddress = _tokenContractAddress;
        hashOfDescription = _hashOfDescription;
        timeToDeliver = _timeAllowedInHours;      
        offerValidUntil = _offerValidUntil;

        // loop through to copy all
        // personalizedOffer
        personalizedOfferCounter = _personalizedOffer.length;
        for(uint256 i = 0; i < _personalizedOffer.length; i++) {
            personalizedOffer[_personalizedOffer[i]] = true;
        }

        // arbiters
        for(uint256 i = 0; i < _arbiters.length; i++) {
            arbiters.push(_arbiters[i]);
        }
    }

    function InitializeBuyer (                                      // NOTE: currently set up to work only with ETH
        address payable _FactoryAddress,
        address payable _buyer,
        address[] calldata _arbiters, 
        uint256 _price,
        address _tokenContractAddress,
        uint256 _timeAllowedInHours,
        string memory _hashOfDescription,       // calldata?
        uint256 _offerValidUntil,
        address[] calldata _personalizedOffer
        
        ) public payable {
        FactoryAddress = _FactoryAddress;
        state = State.buyer_initialized;
        buyer = _buyer;
        price = _price;
        tokenContractAddress = _tokenContractAddress;
        hashOfDescription = _hashOfDescription;
        timeToDeliver = _timeAllowedInHours;      
        offerValidUntil = _offerValidUntil;



        if(_tokenContractAddress == address(0)){
            require(msg.value >= _price, "not enough ETH send");        // only for ETH 
            state = State.buyer_initialized_and_paid;
        }
        else{
            // cannot approve ERC20 directly
            // because we are using proxy, and only msg.sender can issue the approval
        }



        // loop through to copy all
        // personalizedOffer
        personalizedOfferCounter = _personalizedOffer.length;
        for(uint256 i = 0; i < _personalizedOffer.length; i++) {
            personalizedOffer[_personalizedOffer[i]] = true;
        }

        // arbiters
        for(uint256 i = 0; i < _arbiters.length; i++) {
            arbiters.push(_arbiters[i]);
        }
    }




    // ---------------------------------------------------------------------------
    //                             READ FUNCTIONS
    // ---------------------------------------------------------------------------

    function IsArbiter(address _arbiter) public view returns(bool){
        for (uint i = 0; i < arbiters.length; i++) {
            if (_arbiter == arbiters[i]) {
                return true;
            }
        }
        return false;
    }

    function isWalletBuyerDelegate(address _buyer) public view returns(bool){
        return buyerDelegates[_buyer];
    }

    function isWalletSellerDelegate(address _seller) public view returns(bool){
        return sellerDelegates[_seller];
    }

    function getArbiters() public view returns(address[] memory){
        return arbiters;
    }

    function getArbitersVote() public view returns(uint256[3] memory){

        // calculate the current vote 
        uint256[3] memory votes;

        for(uint256 i = 0; i < arbiters.length; i++) {
            uint256 vote = arbitersVote[arbiters[i]];
            votes[vote]++; 
        }

        return votes;
    }

    function isOfferValid() public view returns(bool){
        return (offerValidUntil >= block.timestamp) ? true : false;
    }

    function isWalletEligibleToAcceptOffer(address wallet) public view returns(bool){
        if(personalizedOfferCounter == 0) { return true;}
        return personalizedOffer[wallet];
    }

    function GetCommision() public view returns(uint256){
        return (uint256(price) / uint256(1000)) * uint256(commision);
    }

 

    // ---------------------------------------------------------------------------
    //                             WRITE FUNCTIONS
    // ---------------------------------------------------------------------------

    // new buyer accepts the agreement
    function acceptOfferBuyer(address payable _buyer) instate(State.await_payment) external payable {

        require(isOfferValid(), "offer is not valid anymore");
        require(isWalletEligibleToAcceptOffer(_buyer), "wallet is not eligible to accept");

        if(tokenContractAddress == address(0)){
            // payment in ETH
            require(msg.value >= price, "not enough ETH send");
        } else {
            // payment in tokenContractAddress currency
            IERC20 tokenContract = IERC20(tokenContractAddress);
            bool transferred = tokenContract.transferFrom(_buyer, address(this), price);
            require(transferred, "ERC20 tokens failed to transfer to contract wallet");
        }

        buyer = _buyer; 
        deadline = block.timestamp + 3600 * timeToDeliver;
        state = State.paid;
    }


    // Seller accepts on agreement made by a Buyer
    function acceptOfferSeller(address payable _seller) instate(State.await_seller_accepts) external {

        require(isOfferValid(), "offer is not valid anymore");
        require(isWalletEligibleToAcceptOffer(_seller), "wallet is not eligible to accept");

        seller = _seller; 
        deadline = block.timestamp + 3600 * timeToDeliver;
        state = State.paid;
    }

    // not sure if needed
    function acceptOfferBuyer_ERC20(address payable _buyer) instate(State.await_payment) external {

        require(isOfferValid(), "offer is not valid anymore");
        require(isWalletEligibleToAcceptOffer(_buyer), "wallet is not eligible to accept");

        // payment in tokenContractAddress currency
        IERC20 tokenContract = IERC20(tokenContractAddress);
        bool transferred = tokenContract.transferFrom(_buyer, address(this), price);
        require(transferred, "ERC20 tokens failed to transfer to contract wallet");

        buyer = _buyer; 
        deadline = block.timestamp + 3600 * timeToDeliver;
        state = State.paid;
    }

    function TransferFunds(address payable receiver) internal {

        if(tokenContractAddress == address(0)){
            // transfer ETH
                
            // transfer commision to the Payzura wallet
            payable(payzuraWallet).transfer(GetCommision());

            // transfer the remaining amount to the receiver
            receiver.transfer(address(this).balance);
        
        } else {

            uint256 commision_ = GetCommision();
            IERC20 tokenContract = IERC20(tokenContractAddress);
            //bool transferred = tokenContract.transferFrom(address(this), payzuraWallet, commision_);                    // think we might need to set the approval for the EscrowFactory to move ERC20 of the contract instance (we set the approval when creating the escrow contract instance)
            bool transferred = tokenContract.transfer(payzuraWallet, commision_);
            require(transferred, "ERC20 tokens failed to transfer to payzuraWallet");
            emit TransferSent(address(this), payzuraWallet, commision_);

            //bool transferred_2 = tokenContract.transferFrom(address(this), receiver, price);
            bool transferred_2 = tokenContract.transfer(receiver, price - commision_);
            require(transferred_2, "ERC20 tokens failed to transfer to receiver");
            emit TransferSent(address(this), receiver, price - commision_);
        }

        // change from 'transferFrom' function to 'transfer' function
        // deploy on Polygon and test on payzura local 
    }


    function TransferFundsNoCommision(address payable receiver) internal {

        if(tokenContractAddress == address(0)){
            // transfer the remaining amount to the receiver
            receiver.transfer(address(this).balance);
        } else {
            IERC20 tokenContract = IERC20(tokenContractAddress);
            uint256 balance = tokenContract.balanceOf(address(this));
            if(balance > 0) {
                bool transferred = tokenContract.transfer(receiver, balance);
                //bool transferred = tokenContract.transferFrom(address(this), receiver, balance);
                require(transferred, "ERC20 tokens failed to transfer to receiver");
                emit TransferSent(address(this), receiver, balance);                
            }
        }
    }

    // --------------------------------------
    //             ONLY SELLER
    // --------------------------------------

    // seller can claim the funds if no dispute and the (deadline + gracePeriod) has passed
    function claimFunds(address _seller) instate(State.paid) onlySellerOrDelegate(_seller) external payable {
        require(block.timestamp > deadline + gracePeriod, "Not able to claim yet. Buyer still has time to open dispute");
        TransferFunds(seller);
        state = State.complete;
        return;
    }

    // seller can return the payment and cancel the agreement
    function returnPayment(address _seller) instate(State.paid) onlySellerOrDelegate(_seller) external payable {
        TransferFunds(buyer);
        state = State.complete;
        return;
    }

    function addSellerDelegates(address _seller, address[] calldata delegates) onlySeller(_seller) external {
        for (uint256 i = 0; i < delegates.length; i++){
            sellerDelegates[delegates[i]] = true;
        }
    }

    function removeSellerDelegates(address _seller, address[] calldata delegates) onlySeller(_seller) external {
        for (uint256 i = 0; i < delegates.length; i++){
            sellerDelegates[delegates[i]] = false;
        }
    }


    // only valid for contracts that Seller created and no buyer has accepted yet!!
    function addSellerPersonalizedOffer(address _seller, address[] calldata _personalizedOffer) onlySeller(_seller) instate(State.await_payment) external {
        personalizedOfferCounter += _personalizedOffer.length;
        for (uint256 i = 0; i < _personalizedOffer.length; i++){
            personalizedOffer[_personalizedOffer[i]] = true;
        }
    }

    function removeSellerPersonalizedOffer(address _seller, address[] calldata _personalizedOffer) onlySeller(_seller) instate(State.await_payment) external {
        personalizedOfferCounter -= _personalizedOffer.length;
        for (uint256 i = 0; i < _personalizedOffer.length; i++){
            personalizedOffer[_personalizedOffer[i]] = false;
        }
    }

        
    function cancelSellerContract(address _seller) instate(State.await_payment) onlySeller(_seller) external {
        // change state to canceled
        state = State.canceled;
    }


    // --------------------------------------
    //             ONLY BUYER
    // --------------------------------------

    // buyer can start a dispute after the deadline has passed
    function startDispute(address _buyer) instate(State.paid) onlyBuyerOrDelegate(_buyer) external {  
        require(block.timestamp > deadline, "Deadline for delivery hasn't passed yet!");
        state = State.dispute;
        return;
    }

    // buyer can release the funds - work was done and confirmed
    function confirmDelivery(address _buyer) instate(State.paid) onlyBuyerOrDelegate(_buyer) external payable { 
        TransferFunds(seller);
        state = State.complete;
        return;
    }

    function addBuyerDelegates(address _buyer, address[] calldata delegates) onlyBuyer(_buyer) external {
        for (uint256 i = 0; i < delegates.length; i++){
            buyerDelegates[delegates[i]] = true;
        }
    }

    function removeBuyerDelegates(address _buyer, address[] calldata delegates) onlyBuyer(_buyer) external {
        for (uint256 i = 0; i < delegates.length; i++){
            buyerDelegates[delegates[i]] = false;
        }
    }

    // only valid for contracts that Buyer created and no seller has accepted yet!!
    function addBuyerPersonalizedOffer(address _buyer, address[] calldata _personalizedOffer) onlyBuyer(_buyer) inEitherStates(State.buyer_initialized_and_paid, State.await_seller_accepts) external {
        personalizedOfferCounter += _personalizedOffer.length;
        for (uint256 i = 0; i < _personalizedOffer.length; i++){
            personalizedOffer[_personalizedOffer[i]] = true;
        }

        state = State.await_seller_accepts;
    }

    function removeBuyerPersonalizedOffer(address _buyer, address[] calldata _personalizedOffer) onlyBuyer(_buyer) inEitherStates(State.buyer_initialized_and_paid, State.await_seller_accepts) external {
        personalizedOfferCounter -= _personalizedOffer.length;
        for (uint256 i = 0; i < _personalizedOffer.length; i++){
            personalizedOffer[_personalizedOffer[i]] = false;
        }

        state = State.await_seller_accepts;
    }


    function fundContract(address _buyer) instate(State.buyer_initialized) onlyBuyer(_buyer) external {  // onlyBuyer(_buyer) - can be ommised in case somebody else would fund the contract
        IERC20 tokenContract = IERC20(tokenContractAddress);
        //console.log("_buyer: ", _buyer);
        //console.log("address(this) ", address(this));
        //console.log("price", price);
        bool transferred = tokenContract.transferFrom(_buyer, address(this), price);
        require(transferred, "ERC20 tokens failed to transfer to contract wallet");
        state = State.buyer_initialized_and_paid;
    }

    function cancelBuyerContract(address _buyer) inEitherStates3(State.buyer_initialized, State.buyer_initialized_and_paid, State.await_seller_accepts) onlyBuyer(_buyer) external {

        // if there is any money in the contract, return it to the buyer
        TransferFundsNoCommision(payable(_buyer));

        // change state to canceled
        state = State.canceled;
    }


 
    // --------------------------------------
    //             ONLY ARBITER
    // --------------------------------------

    function handleDispute(address _arbiter, bool returnFundsToBuyer) instate(State.dispute) onlyArbiters(_arbiter) external payable returns(bool){
        
        // add a vote
        if(returnFundsToBuyer){
            arbitersVote[_arbiter] = 1;
        } else {
            arbitersVote[_arbiter] = 2;
        }
        
        // check if the vote makes a majority -> if yes: send funds
        uint256[3] memory votes = getArbitersVote();

        if(votes[1] > votes[2] + votes[0]){
            // send funds to the buyes
            //buyer.transfer(address(this).balance);
            TransferFundsNoCommision(buyer);    // we should not be taking commision if the buyer has their money returned
            state = State.complete;
            return true;
        } 
        
        if(votes[2] > votes[1] + votes[0]){
            // send funds to the seller
            //seller.transfer(address(this).balance);
            TransferFunds(seller);
            state = State.complete;
            return true;
        }

        return false;
    }
}