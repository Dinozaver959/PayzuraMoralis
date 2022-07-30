// export const ABI = [{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DeliveryConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"bool","name":"_FundsReturnedToBuyer","type":"bool"}],"name":"DisputeClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DisputeStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_arbiter","type":"address"},{"indexed":true,"internalType":"bool","name":"_returnFundsToBuyer","type":"bool"}],"name":"DisputeVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"FundsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"OfferAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"_price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timeToDeliver","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_offerValidUntil","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"_personalizedOffer","type":"address[]"},{"indexed":false,"internalType":"address[]","name":"_arbiters","type":"address[]"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"PaymentReturned","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ClaimFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ConfirmDelivery","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"arbiters","type":"address[]"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"timeToDeliver","type":"uint256"},{"internalType":"string","name":"hashOfDescription","type":"string"},{"internalType":"uint256","name":"offerValidUntil","type":"uint256"},{"internalType":"address[]","name":"personalizedOffer","type":"address[]"}],"name":"CreateEscrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbiters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbitersVote","outputs":[{"internalType":"uint256[3]","name":"","type":"uint256[3]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBuyer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetCommision","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetGracePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetHashOfDescription","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetIsOfferStillValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletABuyerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletASellerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletEligibleToAcceptOffer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetSeller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetState","outputs":[{"internalType":"enum Escrow.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTimeLeftToDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetValidUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bool","name":"returnFundsToBuyer","type":"bool"}],"name":"HandleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ReturnPayment","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"SetImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"StartDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clonedContractsIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


// export const ABI = [{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DeliveryConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"bool","name":"_FundsReturnedToBuyer","type":"bool"}],"name":"DisputeClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DisputeStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_arbiter","type":"address"},{"indexed":true,"internalType":"bool","name":"_returnFundsToBuyer","type":"bool"}],"name":"DisputeVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"FundsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"OfferAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"_price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_timeToDeliver","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_offerValidUntil","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"_personalizedOffer","type":"address[]"},{"indexed":false,"internalType":"address[]","name":"_arbiters","type":"address[]"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"PaymentReturned","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ClaimFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ConfirmDelivery","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"arbiters","type":"address[]"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"tokenContractAddress","type":"address"},{"internalType":"uint256","name":"timeToDeliver","type":"uint256"},{"internalType":"string","name":"hashOfDescription","type":"string"},{"internalType":"uint256","name":"offerValidUntil","type":"uint256"},{"internalType":"address[]","name":"personalizedOffer","type":"address[]"}],"name":"CreateEscrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbiters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbitersVote","outputs":[{"internalType":"uint256[3]","name":"","type":"uint256[3]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBuyer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetCommision","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetGracePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetHashOfDescription","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetIsOfferStillValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletABuyerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletASellerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletEligibleToAcceptOffer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetSeller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetState","outputs":[{"internalType":"enum Escrow.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTimeLeftToDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTokenContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetValidUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bool","name":"returnFundsToBuyer","type":"bool"}],"name":"HandleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ReturnPayment","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"SetImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"StartDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clonedContractsIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

// was working fine (just adding `transfer` function for test in next ABI)
//export const ABI = [{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DeliveryConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"bool","name":"_FundsReturnedToBuyer","type":"bool"}],"name":"DisputeClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DisputeStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_arbiter","type":"address"},{"indexed":true,"internalType":"bool","name":"_returnFundsToBuyer","type":"bool"}],"name":"DisputeVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"FundsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"OfferAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"_price","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"_personalizedOffer","type":"address[]"},{"indexed":false,"internalType":"address[]","name":"_arbiters","type":"address[]"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"PaymentReturned","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer_ERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ClaimFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ConfirmDelivery","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"arbiters","type":"address[]"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"tokenContractAddress","type":"address"},{"internalType":"uint256","name":"timeToDeliver","type":"uint256"},{"internalType":"string","name":"hashOfDescription","type":"string"},{"internalType":"uint256","name":"offerValidUntil","type":"uint256"},{"internalType":"address[]","name":"personalizedOffer","type":"address[]"}],"name":"CreateEscrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbiters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbitersVote","outputs":[{"internalType":"uint256[3]","name":"","type":"uint256[3]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBuyer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetCommision","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetGracePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetHashOfDescription","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetIsOfferStillValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletABuyerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletASellerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletEligibleToAcceptOffer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetSeller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetState","outputs":[{"internalType":"enum Escrow.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTimeLeftToDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTokenContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetValidUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bool","name":"returnFundsToBuyer","type":"bool"}],"name":"HandleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20TokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PayERC20_transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20TokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PayERC20_transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ReturnPayment","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"SetImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"StartDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clonedContractsIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


export const ABI = [{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DeliveryConfirmed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"bool","name":"_FundsReturnedToBuyer","type":"bool"}],"name":"DisputeClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"DisputeStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_arbiter","type":"address"},{"indexed":true,"internalType":"bool","name":"_returnFundsToBuyer","type":"bool"}],"name":"DisputeVoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"FundsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_buyer","type":"address"}],"name":"OfferAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"_price","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"_personalizedOffer","type":"address[]"},{"indexed":false,"internalType":"address[]","name":"_arbiters","type":"address[]"}],"name":"OfferCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"clonedContractsIndex","type":"uint256"},{"indexed":true,"internalType":"address","name":"_seller","type":"address"}],"name":"PaymentReturned","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"AcceptOffer_ERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"AddSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ClaimFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ConfirmDelivery","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"arbiters","type":"address[]"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"tokenContractAddress","type":"address"},{"internalType":"uint256","name":"timeToDeliver","type":"uint256"},{"internalType":"string","name":"hashOfDescription","type":"string"},{"internalType":"uint256","name":"offerValidUntil","type":"uint256"},{"internalType":"address[]","name":"personalizedOffer","type":"address[]"}],"name":"CreateEscrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbiters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetArbitersVote","outputs":[{"internalType":"uint256[3]","name":"","type":"uint256[3]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetBuyer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetCommision","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetGracePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetHashOfDescription","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetIsOfferStillValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletABuyerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletASellerDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"GetIsWalletEligibleToAcceptOffer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetSeller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetState","outputs":[{"internalType":"enum Escrow.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTimeLeftToDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetTokenContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"GetValidUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"bool","name":"returnFundsToBuyer","type":"bool"}],"name":"HandleDispute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20TokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PayERC20_transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20TokenAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PayERC20_transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegates","type":"address[]"}],"name":"RemoveSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"ReturnPayment","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"SetImplementation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"StartDispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateBuyerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address[]","name":"delegatesToAdd","type":"address[]"},{"internalType":"address[]","name":"delegatesToRemove","type":"address[]"}],"name":"UpdateSellerDelegates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clonedContractsIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]


export const ABI_ERC20 = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

// to get new ABI files, run:
// solcjs --abi -o output EscrowFactory.sol

