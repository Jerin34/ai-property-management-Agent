import { analyseMaintenaceRequest } from "./services/ai.service.js";
const testAi = async() =>{
    try{
        const result = await analyseMaintenaceRequest(
            "small issue in painting"
        )
        console.log(result.priority)
        console.log(result.category)
        console.log(result.summary)

    }
    catch(err){
        console.log(err)
    }
};
testAi()