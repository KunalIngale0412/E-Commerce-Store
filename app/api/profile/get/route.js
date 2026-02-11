import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

export async function GET(){
    try {
        await connectDB()
        const auth = await isAuthenticated('user')
                if(!auth.isAuth){
                    return response(false, 403, 'Unauthorized.')
                }

                const userId = auth.userId

                const user = await UserModel.findById(userId).lean()


                return response(true, 200, 'User profile data.', user)
    } catch (error) {
        return catchError(error)
    }
}