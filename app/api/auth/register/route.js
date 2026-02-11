import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    // Validation Schema
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });
    const payload = await request.json();

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { name, email, password } = validatedData.data;

    // User already Registered
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(true, 409, "User already Registered.");
    }

    // new Registration
    const NewRegisteration = new UserModel({
      name,
      email,
      password,
    });

    await NewRegisteration.save();

    // Here we created a token using a jose library
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: NewRegisteration._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    // process.env.NEXT_PUBLIC_BASE_URL : THIS IS AN WEBSITE LINK .  verify-email is our relative
    await sendMail(
      "Email Verification request from Kunal Ingale",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    return response(
      true,
      200,
      "Registeration success, Please verify your email address."
    );
    } catch (error) {
      catchError(error)
    }
}


// import { emailVerificationLink } from "@/email/emailVerificationLink";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { sendMail } from "@/lib/sendMail";
// import { zSchema } from "@/lib/zodSchema";
// import UserModel from "@/models/User.model";
// import { SignJWT } from "jose";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const validationSchema = zSchema.pick({
//       name: true,
//       email: true,
//       password: true,
//     });

//     const payload = await request.json();
//     const validatedData = validationSchema.safeParse(payload);

//     if (!validatedData.success) {
//       return response(
//         false,
//         401,
//         "Invalid or missing input field.",
//         validatedData.error
//       );
//     }

//     const { name, email, password } = validatedData.data;

//     const checkedUser = await UserModel.exists({ email });
//     if (checkedUser) {
//       return response(true, 409, "User already Registered.");
//     }

//     const NewRegisteration = new UserModel({ name, email, password });
//     await NewRegisteration.save();

//     const secret = new TextEncoder().encode(process.env.SECRET_KEY);
//     const token = await new SignJWT({ userId: NewRegisteration._id })
//       .setIssuedAt()
//       .setExpirationTime("1h")
//       .setProtectedHeader({ alg: "HS256" })
//       .sign(secret);

//     await sendMail(
//       "Email Verification request from Kunal Ingale",
//       email,
//       emailVerificationLink(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`
//       )
//     );

//     return response(
//       true,
//       200,
//       "Registration success, please verify your email address."
//     );
//   } catch (error) {
//     // ✅ return a response even when error happens
//     return catchError(error);
//   }
// }
