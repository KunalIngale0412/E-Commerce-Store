import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        await connectDB()

        const payload = await request.json()
        const schema = zSchema.pick({
            amount: true,
        })
        const vaildate = schema.safeParse(payload)

        if(!vaildate.success) {
            return response(false, 400, "Validation error.", {error: vaildate.error})
        }

        const {amount} = vaildate.data

        // Create order id using razorpay
        const razInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const razOption = {
            amount: Number(amount) * 100, // amount in paise
            currency: "INR",
        }

        const orderDetails = await razInstance.orders.create(razOption)
        const order_id = orderDetails.id
        return response(true, 200, "Order created successfully.", order_id)

    } catch (error) {
        return catchError(error);
    }
}