export const WEBSITE_HOME = "/"
export const WEBSITE_LOGIN = "/auth/login"
export const WEBSITE_REGISTER = "/auth/register"
export const WEBSITE_RESETPASSWORD = "/auth/reset-password"

export const WEBSITE_SHOP = '/shop'

// Product Detail Route of shop link of home page
export const WEBSITE_PRODUCT_DETAILS = (slug) => slug? `/product/${slug}` : '/product'

// Cart Route
export const WEBSITE_CART= '/cart'


// Checkout route
export const WEBSITE_CHECKOUT= '/checkout'


// Order Details route
export const WEBSITE_ORDER_DETAILS = (order_id) => `/order-details/${order_id}`


// User Account Routes
export const USER_DASHBOARD = "/my-account"
export const USER_PROFILE = "/profile"
export const USER_ORDERS = "/orders"