import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import {GetAvailableProposals} from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const proposals = await GetAvailableProposals();

    var packagedProposals = []

    console.log("packagedProposals.length: " + packagedProposals.length);
    

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

