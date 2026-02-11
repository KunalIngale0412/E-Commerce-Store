import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";
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
        {color:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it 
        {size:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the slug and filter it 
        {sku:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the slug and filter it 
        {"productData.name":{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the slug and filter it 
        {
          $expr:{
            $regexMatch:{
              input: {$toString:"$mrp"},
              regex: globalFilters,
              options:'i'
            }
          }
        },
        {
          $expr:{
            $regexMatch:{
              input: {$toString:"$sellingPrice"},
              regex: globalFilters,
              options:'i'
            }
          }
        },
        {
          $expr:{
            $regexMatch:{
              input: {$toString:"$discountPercentage"},
              regex: globalFilters,
              options:'i'
            }
          }
        },
        
      ]
    }


    // Column filteration : There are multiple filter that are added into forEach function. In this we get an filter.id (id will be an column name means go to column.js in lib there is an accessoryKey it is  nothing but an id and than it will  match to its value) 

    filters.forEach(filter => {
      if(filter.id === 'mrp' || filter.id === 'sellingPrice' || filter.id === 'discountPercentage'){
         matchQuery[filter.id] = Number(filter.value)
      }else if(filter.id === 'product'){
        matchQuery[productData.name] = {$regex: filter.value , $options: 'i'}
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
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      {
        $unwind:{
          path: '$productData',
          preserveNullAndEmptyArrays:true
      }},
      {$match: matchQuery},
      {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
      {$skip: start},
      {$limit: size},
      {
        $project:{
          _id: 1,
          product: "$productData.name",
          color: 1,
          size: 1,
          sku: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1
        }
      }
    ]

    // Execute Query

    const getProductVariant = await ProductVariantModel.aggregate(aggregatePipeline)

    // Get totalRowCount

    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery)

    return NextResponse.json({
      success: true,
      data: getProductVariant,
      meta: {totalRowCount}
    })


  } catch (error) {
    return catchError(error);
  }
}
