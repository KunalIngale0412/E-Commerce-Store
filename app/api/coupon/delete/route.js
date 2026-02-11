import { connectDB } from "@/lib/databaseConnection";
import { catchError,  response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function PUT(request) {
  // Restore soft deleted media
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized Access.");
    }
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Inavaild or empty ids list.");
    }

    const data = await CouponModel.find({ _id: { $in: ids } }).lean();
    if (!data.length === 0) {
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(
        false,
        400,
        "Invalid delete operation. DeleteType must be SD or RSD for this route."
      );
    }

    if (deleteType === "SD") {
      // Soft Delete
      await CouponModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
      return response(true, 200, "Data moved to trash.");
    } else {
      // Restore Soft Deleted
      await CouponModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, "Media restored successfully.");
    }

    
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized Access.");
    }
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Inavaild or empty ids list.");
    }

    const data = await CouponModel.find({ _id: { $in: ids } }).lean();
    if (!data.length === 0) {
      return response(false, 404, "Data not found.");
    }

    if (!deleteType === "PD") {
      return response(
        false,
        400,
        "Invalid delete operation. DeleteType must be PD for this route."
      );
    }

    await CouponModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Media permanently deleted successfully.");
  } catch (error) {
    return catchError(error);
  }
}
