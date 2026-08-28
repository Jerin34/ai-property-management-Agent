    import "dotenv/config";
    const PORT =  Number(process.env.PORT) || 5000
    const MONGODB_URI = process.env.MONGODB_URI
    if(MONGODB_URI === undefined) throw new Error('MONGODB_URI is not defined')
    const JWT_SECRET = process.env.JWT_SECRET
    if(JWT_SECRET === undefined) throw new Error('JWT_SECRET is not defined')
    const GEMINI_API_KEY =  process.env.GEMINI_API_KEY;
    if(GEMINI_API_KEY === undefined)  throw new Error('Gemini api key not found')
    const env ={
        PORT,
        MONGODB_URI,
        JWT_SECRET,
        GEMINI_API_KEY
    }

    export default env