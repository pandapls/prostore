import { auth } from '@/auth'

export default auth

export const config = {
    matcher: [
        '/shipping-address',
        '/payment-method',
        '/place-order',
        '/profile',
        '/user/:path*',
        '/order/:path*',
        '/admin/:path*'
    ]
}
