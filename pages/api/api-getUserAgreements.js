import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { GetUsersAgreements } from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const UserWallet = ParsePathGiveUserWallet(req.url);
    if(UserWallet == -1){res.end()}

    const proposals = await GetUsersAgreements(UserWallet);
    var packagedProposals = [];  
    for(let i = 0; i < proposals.length; i++){
        packagedProposals.push({id: i+1, name : proposals[i]})
        console.log("proposals[i]: " + proposals[i]);
    }

    res.end(JSON.stringify(packagedProposals, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute



function ParsePathGiveUserWallet(_url){

    const params = _url.split("?");
    if(params.length < 2){
        return -1;
    }

    const UserWallet = params[1].split("=");
    if(UserWallet.length < 2){
        return -1;
    }

    return UserWallet[1].split("&")[0];
}