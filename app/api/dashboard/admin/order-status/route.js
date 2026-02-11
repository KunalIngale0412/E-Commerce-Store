import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";

export async function GET() {
    try {
         const auth = await isAuthenticated("admin");
                
        if (!auth.isAuth) {
             return response(false, 403, "Unauthorized user.");
          }
          await connectDB()

          const orderStatus = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt :null,
            }
        },
        {
            $group:{
                _id:"$status",
                count: {$sum : 1}
            }
        },
        {
            $sort: {count : 1}
        }
            
          ])

          return response(200, true, "Data Found.", orderStatus)
    } catch (error) {
        return catchError(error)
    }
}