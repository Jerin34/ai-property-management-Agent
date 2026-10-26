    import "dotenv/config";
    const PORT =  Number(process.env.PORT) || 5000
    const MONGODB_URI = process.env.MONGODB_URI
    if(MONGODB_URI === undefined) throw new Error('MONGODB_URI is not defined')
    const JWT_SECRET = process.env.JWT_SECRET
    if(JWT_SECRET === undefined) throw new Error('JWT_SECRET is not defined')
    const GEMINI_API_KEY =  process.env.GEMINI_API_KEY;
    if(GEMINI_API_KEY === undefined)  throw new Error('Gemini api key not found')
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
if(RAZORPAY_KEY_ID === undefined) throw new Error('RAZORPAY_KEY_ID is not defined')
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if(RAZORPAY_KEY_SECRET === undefined) throw new Error('RAZORPAY_KEY_SECRET is not defined')
    const RAZORPAY_PLAN_ID = process.env.RAZORPAY_PLAN_ID
if(RAZORPAY_PLAN_ID === undefined) throw new Error('RAZORPAY_PLAN_ID is not defined')
    const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET
if(RAZORPAY_WEBHOOK_SECRET === undefined) throw new Error('RAZORPAY_WEBHOOK_SECRET is not defined')
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
if(CLOUDINARY_CLOUD_NAME === undefined) throw new Error('CLOUDINARY_CLOUD_NAME is not defined')
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
if(CLOUDINARY_API_KEY === undefined) throw new Error('CLOUDINARY_API_KEY is not defined')
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
if(CLOUDINARY_API_SECRET === undefined) throw new Error('CLOUDINARY_API_SECRET is not defined')
    const env = {
        PORT,
        MONGODB_URI,
        JWT_SECRET,
        GEMINI_API_KEY,
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
        RAZORPAY_PLAN_ID,
        RAZORPAY_WEBHOOK_SECRET,
        CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET,
    }
    export default env