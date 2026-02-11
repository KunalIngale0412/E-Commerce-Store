import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB()
    const payload = await request.json()

    const productSchema = z.object({
      productId: z.string().length(24, "Invalid product ID."),
      variantId: z.string().length(24, "Invalid variant ID."),
      name: z.string().min(1, "Name is required."),
      qty: z.number().min(1, "Quantity must be at least 1."),
      mrp: z.number().nonnegative("MRP cannot be negative."),
      sellingPrice: z.number().nonnegative("Selling price cannot be negative."),
    })
    const orderSchema = zSchema.pick({
      name: true,
      email: true,
      phone: true, 
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
    }).extend({
      userId: z.string().optional(),
      razorpay_payment_id: z.string().min(3, "Payment ID is required."),
      razorpay_order_id: z.string().min(3, "Order ID is required."),
      razorpay_signature: z.string().min(3, "Signature is required."),
      subTotal: z.number().nonnegative("Subtotal cannot be negative."),
      discount: z.number().nonnegative("Discount cannot be negative."),
      totalAmount: z.number().nonnegative("Total amount cannot be negative."),
      couponDiscountAmount: z.number().nonnegative("Coupon discount cannot be negative.").optional(),
      products: z.array(productSchema)
    })


    const validate = orderSchema.safeParse(payload)

    if(!validate.success){
      return response(false, 400, "Validation error", {error: validate.error})

    }

    const validatedData = validate.data

    // payment verification logic can be added here

    const verification = validatePaymentVerification({
      order_id: validatedData.razorpay_order_id,
      payment_id: validatedData.razorpay_payment_id,
      
    }, validatedData.razorpay_signature, process.env.RAZORPAY_KEY_SECRET)


    let paymentVerification = false
    if(verification){
      paymentVerification = true
    }

    const newOrder = await OrderModel.create({
      user: validatedData.userId,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      country: validatedData.country,
      state: validatedData.state,
      city: validatedData.city,
      pincode: validatedData.pincode,
      landmark: validatedData.landmark,
      ordernote: validatedData.ordernote,
      products: validatedData.products,
      subTotal: validatedData.subTotal,
      discount: validatedData.discount,
      totalAmount: validatedData.totalAmount,
      couponDiscountAmount: validatedData.couponDiscountAmount,
      payment_id: validatedData.razorpay_payment_id,
      order_id: validatedData.razorpay_order_id,
      status: paymentVerification ? "Pending" : "Processing"
    })

    try {
      const mailData = {
        order_id:validatedData.razorpay_order_id,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id}`
      }

      await sendMail("Order Placed Successfully.", validatedData.email, orderNotification(mailData))




    } catch (error) {
      console.log(error);
    }

    return response(true, 200, "Order saved successfully")

  } catch (error) {
    return catchError(error);
  }
}