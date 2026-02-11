import { NextResponse } from "next/server"
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  })
}

export const catchError = (error, customMessage) => {
  // handling duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(",")
    error.message = `Duplicate fields: ${keys}. These fileds values are unique.`
  }

  let errorObj = {};
  if (process.env.NODE_ENV === 'development') {
    errorObj = {
      message: error.message,
      error,
    }
  } else {
    errorObj = {
      message: customMessage || "Internal server error.",
    }
  }

  return NextResponse.json({
    success: false,
    statusCode: error.code,
    ...errorObj,
  })
}

export const generateOTP = () =>{
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  return otp
}





export const columnConfig = (column, isCreatedAt = false, isUpdatedAt=false, isDeletedAt=false)=>{
    const newColumn = [...column] 


    if(isCreatedAt){
      newColumn.push({
        accessorKey: 'createdAt',
        header: 'Created At',
        Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
      })
    }
    if(isUpdatedAt){
      newColumn.push({
        accessorKey: 'updatedAt',
        header: 'Updated At',
        Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
      })
    }
    if(isDeletedAt){
      newColumn.push({
        accessorKey: 'deletedAt',
        header: 'Deleted At',
        Cell:({renderedCellValue}) => (new Date(renderedCellValue).toLocaleString())
      })
    }

    return newColumn
}



export const statusBadge = (status)  => {
  const statusColorConfig = {
    Pending : 'bg-blue-500',
    Processing: 'bg-yellow-500',
    Shipped: 'bg-cyan-500',
    Delivered: 'bg-green-500',
    Cancelled: 'bg-red-500',
    UnVerified: 'bg-orange-500'
  }
  return <span className={`${statusColorConfig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
}