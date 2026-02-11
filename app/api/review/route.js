import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import { NextResponse } from "next/server";
export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized user.");
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams

    // Extract query parameters like start,size,filter, globalFilters,sorting,deleteType

    const start = parseInt(searchParams.get('start')|| 0, 10)
    const size = parseInt(searchParams.get('size')|| 10, 10)
    const filters = JSON.parse(searchParams.get('filters') || "[]")
    const globalFilters = searchParams.get('globalFilters') || ""
    const sorting = JSON.parse(searchParams.get('sorting') || "[]")
    const deleteType = searchParams.get('deleteType')

    // Build match query
    let matchQuery = {}

    if(deleteType === 'SD'){ //SD means non-deleted data  show and in PD which is permanently deleted data show
      matchQuery = {deletedAt: null}
    }else if(deleteType === 'PD'){
      matchQuery = {deletedAt: {$ne: null}}
    }
    

    // Global Search : Why we provided or because we don't know where it is present 

    if(globalFilters){
      matchQuery["$or"] = [
        {"productData.name":{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {"userData.name":{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {rating:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {title:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {review:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        
        
      ]
    }


    // Column filteration : There are multiple filter that are added into forEach function. In this we get an filter.id (id will be an column name means go to column.js in lib there is an accessoryKey it is  nothing but an id and than it will  match to its value) 

    filters.forEach(filter => {
      if(filter.id === 'product' ){
        matchQuery['productData.name']= {$regex: filter.value , $options: 'i'}
      }else if(filter.id === 'user'){
        matchQuery['userData.name']= {$regex: filter.value , $options: 'i'}
      }
      else{
        matchQuery[filter.id]= {$regex: filter.value , $options: 'i'}
      }
    });

    // Sorting 
    let sortQuery = {}
    sorting.forEach(sort => {
      sortQuery[sort.id] = sort.desc ? -1 : 1 
    });

    // Aggregate pipeline

    const aggregatePipeline = [
      {
        $lookup:{
          from:'products',
          localField:'product',
          foreignField:'_id',
          as: 'productData'
        }
      },
      {
        $unwind:{path: '$productData', preserveNullAndEmptyArrays: true}
      },
      {
        $lookup:{
          from:'users',
          localField:'user',
          foreignField:'_id',
          as: 'userData'
        }
      },
      {
        $unwind:{path: '$userData', preserveNullAndEmptyArrays: true}
      },

     
      {$match: matchQuery},
      {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
      {$skip: start},
      {$limit: size},
      {
        $project:{
          _id: 1,
          product: '$productData.name',
          user: '$userData.name',
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ]

    // Execute Query

    const getReview = await ReviewModel.aggregate(aggregatePipeline)

    // Get totalRowCount

    const totalRowCount = await ReviewModel.countDocuments(matchQuery)

    return NextResponse.json({
      success: true,
      data: getReview,
      meta: {totalRowCount}
    })


  } catch (error) {
    return catchError(error);
  }
}
