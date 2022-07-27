import middleware from "../../middleware/middleware";
import nextConnect from "next-connect";
import { GetUsersAgreementsOnlySeller } from "../../JS/DB-cloudFunctions";
import { ParsePathGiveUserWallet } from "../../JS/BackendFunctions";

const apiRoute = nextConnect();
apiRoute.use(middleware);

apiRoute.get(async (req, res) => {
    console.log(req.body);

    const UserWallet = ParsePathGiveUserWallet(req.url);
    if (UserWallet == -1) {
        res.end();
    }

    const offers = await GetUsersAgreementsOnlySeller(UserWallet.toLowerCase());
    var packagedOffers = [];

    for (let i = 0; i < offers.length; i++) {
        if (
            JSON.parse(JSON.stringify(offers[i], null, 3)).SellerWallet ==
            UserWallet
        ) {
            packagedOffers.push({ id: i + 1, name: offers[i] });
            //console.log("offers[i]: " + offers[i]);
        }
    }

    res.end(JSON.stringify(packagedOffers, null, 3));
});

export const config = {
    api: {
        bodyParser: false,
    },
};
export default apiRoute;
