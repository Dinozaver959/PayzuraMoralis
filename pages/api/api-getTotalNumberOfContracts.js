import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { GetTotalNumberOfContracts } from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const numberOfContracts = await GetTotalNumberOfContracts();

    console.log("numberOfContracts:")
    console.log(numberOfContracts)

    res.end(JSON.stringify(numberOfContracts, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

