// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ReentrancyGuard.sol";
import "./IERC20.sol";
//import "../node_modules/hardhat/console.sol";

contract Escrow is ReentrancyGuard {

    address payable public seller;
    uint256 public price;
    address public tokenContractAddress;   // address(0) -> ETH, other currencies have their contracts

    address[] private sellerReferrerAddress;
    address[] private buyerReferrerAddress;


    uint256 public deadline;
    uint256 public timeToDeliver;
    uint256 public offerValidUntil;
    string public hashOfDescription;
    //uint256 public immutable gracePeriod = 86400;   // 24h
    uint256 public immutable gracePeriod = 0;

    uint256 public immutable commision = 125; // 10000 = 100%
    //uint256 public referralCommision;
    address public immutable payzuraWallet = 0x1591C783EfB2Bf91b348B6b31F2B04De1442836c;
    address public immutable jobzura = 0x1591C783EfB2Bf91b348B6b31F2B04De1442836c;
    
    address payable public buyer;
    address[] public arbiters;
    mapping(address => uint256) arbitersVote;

    mapping(address => bool) buyerDelegates;
    mapping(address => bool) sellerDelegates;


    address payable public FactoryAddress;

    mapping(address => bool) personalizedOffer;
    uint256 personalizedOfferCounter;
    enum State { await_payment, buyer_initialized_and_paid, await_seller_accepts, paid, dispute, complete, canceled }
    // need to update the naming:
    /*
        await_payment               - seller started the contract, no buyer has paid/accepted yet
        buyer_initialized_and_paid  - buyer had initialized and paid
        await_seller_accepts        - buyer has updated the list of personalizedOffer for potential sellers
        paid                        - contract has been signed by both parties
        dispute                     - contract has entered the dispute
        complete                    - contract is complete (either the service was delivered and acknowledge or a dispute has ended)    
     */
    State public state;
      
    //event MoneyEarned(address _token, address _from, address _destAddr, uint _amount);
    //event MoneyEarnedReferral(address _token, address _from, address _destAddr, uint _amount);
    //event FundsTransfered(address _token, address _from, address _destAddr, uint _amount);



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
        uint256 _price,
        address _tokenContractAddress,
        uint256 _timeAllowedInHours,
        string memory _hashOfDescription,       // calldata?
        uint256 _offerValidUntil
        ) public {

        FactoryAddress = _FactoryAddress;
        state = State.await_payment;
        seller = _seller;
        price = _price;
        tokenContractAddress = _tokenContractAddress;
        hashOfDescription = _hashOfDescription;
        timeToDeliver = _timeAllowedInHours;      
        offerValidUntil = _offerValidUntil;
    }

    function InitializeSellerPart2(address[] calldata _arbiters, address[] calldata _personalizedOffer, address[] calldata _referrerAddress) public {
        
        // loop through to copy all
        // arbiters
        for(uint256 i = 0; i < _arbiters.length; i++) {
            arbiters.push(_arbiters[i]);
        }

        // personalizedOffer
        personalizedOfferCounter = _personalizedOffer.length;
        for(uint256 i = 0; i < _personalizedOffer.length; i++) {
            personalizedOffer[_personalizedOffer[i]] = true;
            personalizedOfferCounter += 1;
        }

      require(_referrerAddress.length <= 3, "at most 3 levels of referrals");

      for(uint256 i = 0; i < _referrerAddress.length; i++) {
        sellerReferrerAddress.push(_referrerAddress[i]);
      } 
    }


    function InitializeBuyer (
      address payable _FactoryAddress,
      address payable _buyer,
      uint256 _price,
      address _tokenContractAddress,
      uint256 _timeAllowedInHours,
      string memory _hashOfDescription,       // calldata?
      uint256 _offerValidUntil      
    ) public payable {
        FactoryAddress = _FactoryAddress;
        state = State.buyer_initialized_and_paid;
        buyer = _buyer;
        price = _price;
        tokenContractAddress = _tokenContractAddress;
        hashOfDescription = _hashOfDescription;
        timeToDeliver = _timeAllowedInHours;      
        offerValidUntil = _offerValidUntil;

        if(_tokenContractAddress == address(0)){
            require(msg.value >= _price, "not enough ETH send");        // only for ETH  
        }
        

    }

    function InitializeBuyerPart2(address[] calldata _arbiters, address[] calldata _personalizedOffer, address[] calldata _referrerAddress) public {

        if(_personalizedOffer.length > 0){
            state = State.await_seller_accepts;
        }

         // loop through to copy all
        // arbiters
        for(uint256 i = 0; i < _arbiters.length; i++) {
            arbiters.push(_arbiters[i]);
        } 
        
        // personalizedOffer
        personalizedOfferCounter = _personalizedOffer.length;
        for(uint256 i = 0; i < _personalizedOffer.length; i++) {
            personalizedOffer[_personalizedOffer[i]] = true;
        }

      require(_referrerAddress.length <= 3, "at most 3 levels of referrals");

      for(uint256 i = 0; i < _referrerAddress.length; i++) {
        buyerReferrerAddress.push(_referrerAddress[i]);
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
        return (uint256(price) / uint256(10000)) * uint256(commision);
    }



    function GetBuyerSellerReferrerCommision(uint256 deployed) public view returns(uint256){
      return (uint256(price) / uint256(10000)) * GetReferralCommission(deployed);   // have it only be a static number for now (TODO: add a 12Months linear falling pattern)
    }

    function GetReferralCommission(uint256 deployed) internal view returns(uint256){
      // initial = 200; // 2% 
      // then it falls every 90 days by 0.25%, until it reaches 0.5% where is stabilizes

      uint256 _90dayPeriods = (block.timestamp - deployed) / 7776000;   // 90 days = 7.776.000s
      uint256 current = 200 - 25 * _90dayPeriods;
      return (current >= 50) ? current : 50;
    }

 

    // ---------------------------------------------------------------------------
    //                             WRITE FUNCTIONS
    // ---------------------------------------------------------------------------

    // new buyer accepts the agreement    -- later change the `_referralCommision` to be more complex so we can authenticate where the request came from
    //function acceptOfferBuyer(address payable _buyer, uint256 _referralCommision, address[] calldata _referrerAddress) instate(State.await_payment) external payable {
    function acceptOfferBuyer(address payable _buyer, address[] calldata _referrerAddress) instate(State.await_payment) external payable {
        require(isOfferValid(), "offer is not valid anymore");
        require(isWalletEligibleToAcceptOffer(_buyer), "wallet is not eligible to accept");
        //require(_referralCommision >= 0 && _referralCommision <= 400, "referral commision should be 4% at the most");
        require(_referrerAddress.length <= 3, "at most 3 levels of referrals");

        if(tokenContractAddress == address(0)){
            // payment in ETH
            require(msg.value >= price, "not enough ETH send");
        } else {
          // done on upper level - EscrowFactory
        }

        for(uint256 i = 0; i < _referrerAddress.length; i++) {
          buyerReferrerAddress.push(_referrerAddress[i]);
        } 

        buyer = _buyer; 
        deadline = block.timestamp + 3600 * timeToDeliver;
        state = State.paid;
        //referralCommision = _referralCommision;
    }

    // Seller accepts on agreement made by a Buyer
    //function acceptOfferSeller(address payable _seller, uint256 _referralCommision, address[] calldata _referrerAddress) instate(State.await_seller_accepts) external {
    function acceptOfferSeller(address payable _seller, address[] calldata _referrerAddress) instate(State.await_seller_accepts) external {

        require(isOfferValid(), "offer is not valid anymore");  
        require(isWalletEligibleToAcceptOffer(_seller), "wallet is not eligible to accept");
        //require(_referralCommision >= 0 && _referralCommision <= 400, "referral commision should be 4% at the most");
        require(_referrerAddress.length <= 3, "at most 3 levels of referrals");

        for(uint256 i = 0; i < _referrerAddress.length; i++) {
          sellerReferrerAddress.push(_referrerAddress[i]);
        } 

        seller = _seller; 
        deadline = block.timestamp + 3600 * timeToDeliver;
        state = State.paid;
        //referralCommision = _referralCommision;
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

    function TransferFunds(address payable receiver, uint256 deployed) internal {

        if(tokenContractAddress == address(0)){
            // transfer ETH

            // transfer commision to the Payzura wallet
            uint256 payzuraCommision = GetCommision();
            payable(payzuraWallet).transfer(payzuraCommision);
            //console.log("transfered to payzura", payzuraCommision);
            //emit FundsTransfered(address(0), address(this), payzuraWallet, payzuraCommision);

            uint256 OneSideReferralCommision = GetBuyerSellerReferrerCommision(deployed) / 2;

            if(OneSideReferralCommision != 0)
            {

              // Buyer Side referral commision
              if(buyerReferrerAddress.length > 0){
                TransferReferralCommisionETH(buyerReferrerAddress[1], (OneSideReferralCommision * 65) / 100);

                if(buyerReferrerAddress.length > 1){
                  TransferReferralCommisionETH(buyerReferrerAddress[1], (OneSideReferralCommision * 25) / 100);
                  
                  if(buyerReferrerAddress.length > 2){
                    TransferReferralCommisionETH(buyerReferrerAddress[2], (OneSideReferralCommision * 10) / 100);
                  }
                }
              }
              

              // Seller side referral commision
              if(sellerReferrerAddress.length > 0){
                TransferReferralCommisionETH(sellerReferrerAddress[0], (OneSideReferralCommision * 65) / 100);

                if(sellerReferrerAddress.length > 1){
                  TransferReferralCommisionETH(sellerReferrerAddress[1], (OneSideReferralCommision * 25) / 100);
                  
                  if(sellerReferrerAddress.length > 2){
                    TransferReferralCommisionETH(sellerReferrerAddress[2], (OneSideReferralCommision * 10) / 100);
                  }
                }
              }



              // Jobzura commision: 275 - GetReferralCommission
              TransferReferralCommisionETH(jobzura, ((uint256(price) / uint256(10000)) * (275 - GetReferralCommission(deployed))));
            }


            // transfer the remaining amount to the receiver
            //emit MoneyEarned(address(0), address(this), receiver, address(this).balance);
            //console.log("transfering the rest to receiver", address(this).balance); 
            receiver.transfer(address(this).balance);   
        
        } else {

            uint256 commision_ = GetCommision();
            IERC20 tokenContract = IERC20(tokenContractAddress);
            //bool transferred = tokenContract.transferFrom(address(this), payzuraWallet, commision_);                    // think we might need to set the approval for the EscrowFactory to move ERC20 of the contract instance (we set the approval when creating the escrow contract instance)
            bool transferred = tokenContract.transfer(payzuraWallet, commision_);
            require(transferred, "ERC20 tokens failed to transfer to payzuraWallet");
            //emit FundsTransfered(tokenContractAddress, address(this), payzuraWallet, commision_);


            uint256 OneSideReferralCommision = GetBuyerSellerReferrerCommision(deployed) / 2;

            if(OneSideReferralCommision != 0)
            {
              // Buyer Side referral commision
              commision_ += TransferReferralCommisionERC20(buyerReferrerAddress[2], (OneSideReferralCommision * 10) / 100, tokenContract);
              commision_ += TransferReferralCommisionERC20(buyerReferrerAddress[1], (OneSideReferralCommision * 25) / 100, tokenContract);
              commision_ += TransferReferralCommisionERC20(buyerReferrerAddress[0], (OneSideReferralCommision * 65) / 100, tokenContract);

              // Seller Side referral commision
              commision_ += TransferReferralCommisionERC20(sellerReferrerAddress[2], (OneSideReferralCommision * 10) / 100, tokenContract);
              commision_ += TransferReferralCommisionERC20(sellerReferrerAddress[1], (OneSideReferralCommision * 25) / 100, tokenContract);
              commision_ += TransferReferralCommisionERC20(sellerReferrerAddress[0], (OneSideReferralCommision * 65) / 100, tokenContract);

              // Jobzura commision: 275 - GetReferralCommission
              commision_ += TransferReferralCommisionERC20(jobzura, ((uint256(price) / uint256(10000)) * (275 - GetReferralCommission(deployed))), tokenContract);
            }


            //bool transferred_2 = tokenContract.transferFrom(address(this), receiver, price);
            bool transferred_2 = tokenContract.transfer(receiver, price - commision_);  // based on total Commision
            require(transferred_2, "ERC20 tokens failed to transfer to receiver");
            //emit MoneyEarned(tokenContractAddress, address(this), receiver, price - commision_);
        }

        // change from 'transferFrom' function to 'transfer' function
        // deploy on Polygon and test on payzura local 
    }

    function TransferReferralCommisionETH(address receiver, uint256 amount) internal {
      if(receiver != address(0)){
        payable(receiver).transfer(amount);   // 10% for 3rd lvl referral
        //emit MoneyEarnedReferral(address(0), address(this), receiver, amount);
        //console.log("transfered", amount);
      }
    }

    function TransferReferralCommisionERC20(address receiver, uint256 amount, IERC20 tokenContract) internal returns(uint256){
      if(receiver != address(0)){
        bool transferredBR = tokenContract.transfer(receiver, amount);
        require(transferredBR, "ERC20 tokens failed to transfer to receiver");
        //emit MoneyEarnedReferral(tokenContractAddress, address(this), receiver, amount);   
        return amount;       
      }
      return 0;
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
                //emit TransferSent(address(this), receiver, balance);    //it wasn't earned               
            }
        }
    }

    // --------------------------------------
    //             ONLY SELLER
    // --------------------------------------

    // seller can claim the funds if no dispute and the (deadline + gracePeriod) has passed
    function claimFunds(address _seller, uint256 deployed) instate(State.paid) onlySellerOrDelegate(_seller) external payable {
        require(block.timestamp > deadline + gracePeriod, "Not able to claim yet. Buyer still has time to open dispute");
        TransferFunds(seller, deployed);
        state = State.complete;
        return;
    }

    // seller can return the payment and cancel the agreement
    function returnPayment(address _seller) instate(State.paid) onlySellerOrDelegate(_seller) external payable {
        TransferFundsNoCommision(buyer);
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
    function confirmDelivery(address _buyer, uint256 deployed) instate(State.paid) onlyBuyerOrDelegate(_buyer) external payable { 
        //console.log("inside confirmDelivery");
        TransferFunds(seller, deployed);
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

    function cancelBuyerContract(address _buyer) inEitherStates(State.buyer_initialized_and_paid, State.await_seller_accepts) onlyBuyer(_buyer) external {

        // if there is any money in the contract, return it to the buyer
        TransferFundsNoCommision(payable(_buyer));

        // change state to canceled
        state = State.canceled;
    }


 
    // --------------------------------------
    //             ONLY ARBITER
    // --------------------------------------


  /*

    function handleDispute(address _arbiter, bool returnFundsToBuyer, uint256 deployed) instate(State.dispute) onlyArbiters(_arbiter) external payable returns(bool){
        
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
            TransferFunds(seller, deployed);
            state = State.complete;
            return true;
        }

        return false;
    }

    */
}