import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
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
        {order_id:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {payment_id:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {name:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {email:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {phone:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {country:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {state:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {city:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {pincode:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {subTotal:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {discount:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {couponDiscountAmount:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {totalAmount:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   
        {status:{$regex: globalFilters, $options: 'i'}}, // here i means insensitive it will not see the lowercase or uppercase letter it directly match the name and filter it   

      ]
    }


    // Column filteration : There are multiple filter that are added into forEach function. In this we get an filter.id (id will be an column name means go to column.js in lib there is an accessoryKey it is  nothing but an id and than it will  match to its value) 

    filters.forEach(filter => {
    matchQuery[filter.id]= {$regex: filter.value , $options: 'i'}
    });

    // Sorting 
    let sortQuery = {}
    sorting.forEach(sort => {
      sortQuery[sort.id] = sort.desc ? -1 : 1 
    });

    // Aggregate pipeline

    const aggregatePipeline = [
     
      {$match: matchQuery},
      {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
      {$skip: start},
      {$limit: size},
    ]

    // Execute Query

    const getOrders = await OrderModel.aggregate(aggregatePipeline)

    // Get totalRowCount

    const totalRowCount = await OrderModel.countDocuments(matchQuery)

    return NextResponse.json({
      success: true,
      data: getOrders,
      meta: {totalRowCount}
    })


  } catch (error) {
    return catchError(error);
  }
}
