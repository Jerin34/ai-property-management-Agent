export interface PropertyAddress{
    street:string;
    city:string;
    state:string;
    postalcode:string;
    country:string;
}
export interface PropertyLocation{
    latitude:number;
    longitude:number;
}
export interface Property{
        _id:string;
        name:string;
        address:PropertyAddress;
        manager:string;
        description?:string;
        isActive:boolean;
        location:PropertyLocation;
        createdAt:Date;
        updatedAt:Date;
}