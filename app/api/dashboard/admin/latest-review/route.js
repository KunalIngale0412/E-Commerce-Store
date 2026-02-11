import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import ProductModel from "@/models/Product.model"; // Import your Product model
import MediaModel from "@/models/Media.model"; // Import your Media model if it exists

export async function GET() {
    try {
        const auth = await isAuthenticated("admin");
                
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized user.");
        }
        
        await connectDB()

        const latestReview = await ReviewModel.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('product')
            .lean()

        // Manually populate media for each review
        for (let review of latestReview) {
            if (review.product && review.product.media && review.product.media.length > 0) {
                // If media is an array of IDs, populate them
                const mediaIds = review.product.media;
                const mediaData = await MediaModel.find({ _id: { $in: mediaIds } })
                    .select('secure_url public_id')
                    .lean();
                review.product.media = mediaData;
            }
        }

        

        return response(true, 200, "Latest Review.", latestReview)
          
    } catch (error) {
      
        return catchError(error)
    }
}