import { connectDB } from "@/lib/databaseConnection";
import { catchError,  response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";


export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized Access.')
        }
        await connectDB()

        const filter = {
            deletedAt: null,
        }

        const getOrders = await OrderModel.find(filter).select("-products").sort({createdAt: -1}).lean()
        
        if(!getOrders){
            return response(false, 404, 'Collection empty.')
        }

        return response(true, 200, 'Order fetched successfully.', getOrders)
    } catch (error) {
        return catchError(error)
    }
}