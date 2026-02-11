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

          const monthlySales = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt :null,
                    status: {$in: ['Processing', 'Shipped','Delivered']}
            }
        },
        {
            $group:{
                _id:{
                    year: {$year: "$createdAt"},
                    month: {$month: "$createdAt"},
                },
                totalSales: {$sum : '$totalAmount'}
            }
        },
        {
            $sort: {"_id.year":1, "_id.month":1}
        }
            
          ])

          return response(200, true, "Data Found.", monthlySales)
    } catch (error) {
        return catchError(error)
    }
}