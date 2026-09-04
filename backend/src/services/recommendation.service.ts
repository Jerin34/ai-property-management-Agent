import User from  '../models/user.model.js'
import Maintenance from '../models/maintenance.model.js'
import { MAINTENANCE_STATUS } from '../constants/maintenance.js'
import { TechnicianRecommendation } from '../types/technician.types.js'
import { calculateDistance } from '../utils/distance.js'
export const recommendTechnicians = async(category:string,priority:string,propertyLatitude:number,propertyLongitude:number):Promise<TechnicianRecommendation[]> =>{
    const technicians = await User.find({role:'TECHNICIAN',skills:category,isActive:true});
    const recommendations:TechnicianRecommendation[] = [];
    let bonus:number = 0; 
    if(priority === 'LOW'){
        bonus = 0;
    }
    else if(priority === 'MEDIUM'){
        bonus = 5;
    }
    else if(priority === 'HIGH'){
        bonus = 10;
    }
    else if(priority === 'EMERGENCY'){
        bonus = 20;
    }
    for (const technician of technicians){

        const activeJobs = await Maintenance.countDocuments({
        technician:technician._id,
        status:{
            $in:[
                MAINTENANCE_STATUS.Open,
                MAINTENANCE_STATUS.InProgress
            ]
        }

        });
        let distance = 20;
        let distancePenalty  =20;
        if(technician.location){
            console.log("Technician latitude:", technician.location.latitude);
console.log("Technician longitude:", technician.location.longitude);
console.log("Property latitude:", propertyLatitude);
console.log("Property longitude:", propertyLongitude);
            distance = calculateDistance(technician.location.latitude,technician.location.longitude,
                propertyLatitude,propertyLongitude

            );
            if(distance <= 5){
                distancePenalty = 0;
            }else if(distance <= 10){
                distancePenalty = 5;
            }
            else if(distance <= 20){
                distancePenalty = 10;
            }
        }
        let score = (100 -  activeJobs*10)+bonus -  distancePenalty;
        const reasons :string[] = [];
        reasons.push(`Skilled in ${category}`)
        reasons.push(`${activeJobs} active maintenance requests`);
        reasons.push(`Bonus of ${bonus} points for ${priority} priority`)
        reasons.push(`Distance from property: ${distance.toFixed(2)} km`);
        reasons.push(`Distance penalty: -${distancePenalty}`);
        recommendations.push({
               technicianId: technician._id.toString(),
            technicianName: technician.name,
            score: Math.min(Math.max(score,0),100),
            reasons            
        })
    }

    recommendations.sort((a,b) => b.score - a.score);
    return recommendations
}