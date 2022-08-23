import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { GetTotalNumberOfUsers } from '../../JS/DB-cloudFunctions'

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
    console.log(req.body)
 
    const numberOfUsers = await GetTotalNumberOfUsers();

    console.log("numberOfUsers:")
    console.log(numberOfUsers)

    res.end(JSON.stringify(numberOfUsers, null, 3));
})

export const config = {
    api: {
      bodyParser: false
    }
} 
export default apiRoute

