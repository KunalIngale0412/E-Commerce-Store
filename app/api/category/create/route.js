import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        
                if(!auth.isAuth){
                    return response(false, 403, 'Unauthorized user.')
                }

                await connectDB()

                const payload = await request.json()
                const schema = zSchema.pick({
                        name: true,
                        slug: true,
                    })



                    const validate = schema.safeParse(payload)

                    if (!validate.success) {
                        return response(false, 400, 'Invalid data', validate.error)
                    }
                    const {name, slug} = validate.data

                    const newCategory =new CategoryModel({
                        name: name,
                        slug: slug,
                    })

                    await newCategory.save()

                    return response(true, 200, 'Category added successfully.')
                
    } catch (error) {
        return catchError(error)
    }
}