export const ADMIN_DASHBOARD = '/admin/dashboard';


// Media Routes
export const ADMIN_MEDIA_SHOW = '/admin/media';
export const ADMIN_MEDIA_EDIT = (id) => id?  `/admin/media/edit/${id}` : ''  // id is media id. if is not provided, return empty string


// Category Routes
export const ADMIN_CATEGORY_SHOW = '/admin/category'; // route to show all categories
export const ADMIN_CATEGORY_ADD = '/admin/category/add'; // route to add category
export const ADMIN_CATEGORY_EDIT = (id) => id?  `/admin/category/edit/${id}` : ''  // id is category id. if is not provided, return empty string


// Product Routes
export const ADMIN_PRODUCT_SHOW = '/admin/product'; // route to show all Products
export const ADMIN_PRODUCT_ADD = '/admin/product/add'; // route to add Products
export const ADMIN_PRODUCT_EDIT = (id) => id?  `/admin/product/edit/${id}` : ''  // id is product id. if is not provided, return empty string
// Product Variant Routes
export const ADMIN_PRODUCT_VARIANT_SHOW = '/admin/product-variant'; // route to show all variant Products
export const ADMIN_PRODUCT_VARIANT_ADD = '/admin/product-variant/add'; // route to add Products Variant
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => id?  `/admin/product-variant/edit/${id}` : ''  // id is product variant id. if is not provided, return empty string
// Coupon Routes
export const ADMIN_COUPON_SHOW = '/admin/coupon'; // route to show all Coupons
export const ADMIN_COUPON_ADD = '/admin/coupon/add'; // route to add Coupon
export const ADMIN_COUPON_EDIT = (id) => id?  `/admin/coupon/edit/${id}` : ''  // id is coupon id. if is not provided, return empty string


// Customers route
export const ADMIN_CUSTOMERS_SHOW = '/admin/customers'; // route to show all Customers
// Rating and Review route
export const ADMIN_REVIEW_SHOW = '/admin/review'; // route to show all Reviews

// Trash route
export const ADMIN_TRASH = '/admin/trash'; 

// Orders Route

export const ADMIN_ORDER_SHOW = '/admin/orders'; // route to show all Reviews
export const ADMIN_ORDER_DETAILS = (order_id) => order_id?  `/admin/orders/details/${order_id}` : ''