import type { NavigationItem } from "../types/navigation.types";

export const NavigationItems : NavigationItem[] = [
    {
        label:"Dashboard",
        path:"/dashboard",
        allowedRoles:["ADMIN","MANAGER","TECHNICIAN","TENANT"]
    },
    {
        label:"Properties",
        path:"/properties",
        allowedRoles:["ADMIN","MANAGER"]
    },
    {
        label:"Maintenance",
        path:"/maintenance",
        allowedRoles:["ADMIN","MANAGER","TENANT"]
    },
    {
        label:"Analytics",
        path:'/analytics',
        allowedRoles:["ADMIN","MANAGER"]
    },
    {
        label:"Cost Analytics",
        path:"/maintenance/cost-analytics",
        allowedRoles:["ADMIN","MANAGER"]
    },
    {
        label:'notification',
        path:'/notification',
        allowedRoles:["ADMIN","MANAGER","TECHNICIAN","TENANT"]
    },
    {
  label: "My Maintenance",
  path: "/technician/maintenance",
  allowedRoles: ["TECHNICIAN"]
},
{
    label: "Maintenance Schedules",
    path: "/maintenance/schedules",
    allowedRoles: ["ADMIN", "MANAGER"]
},

]