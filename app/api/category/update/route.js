import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        
                if(!auth.isAuth){
                    return response(false, 403, 'Unauthorized user.')
                }

                await connectDB()

                const payload = await request.json()
                const schema = zSchema.pick({
                    _id: true,
                        name: true,
                        slug: true,
                    })



                    const validated = schema.safeParse(payload)

                    if (!validated.success) {
                        return response(false, 400, 'Invalid data.', validated.error)
                    }
                    const {_id ,name, slug} = validated.data
                    const getCategory = await CategoryModel.findOne({deletedAt: null, _id})

                    if(!getCategory){
                        return response(false, 400, 'Data not found.')
                    }

                    getCategory.name = name
                    getCategory.slug = slug

                    await getCategory.save()

                    return response(true, 200, 'Category updated successfully.')
                
    } catch (error) {
        return catchError(error)
    }
}