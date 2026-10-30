import type { NavigationItem } from "../types/navigation.types";

export const NavigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    allowedRoles: ["ADMIN", "MANAGER", "TECHNICIAN", "TENANT"],
  },
  {
    label: "Tenant Requests",
    path: "/tenant-requests",
    allowedRoles: ["MANAGER"],
  },
  {
    label: "My Property",
    path: "/my-property",
    allowedRoles: ["TENANT"],
  },
  {
    label: "Apply for Manager Role",
    path: "/apply-for-manager",
    allowedRoles: ["TENANT"],
  },
  {
    label: "Manager Applications",
    path: "/admin/role-approvals",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Properties",
    path: "/properties",
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Maintenance",
    path: "/maintenance",
    allowedRoles: ["ADMIN", "MANAGER", "TENANT"],
  },
  {
    label: "Analytics",
    path: "/analytics",
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Cost Analytics",
    path: "/maintenance/cost-analytics",
    allowedRoles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Notifications",
    path: "/notification",
    allowedRoles: ["ADMIN", "MANAGER", "TECHNICIAN", "TENANT"],
  },
  {
    label: "My Maintenance",
    path: "/technician/maintenance",
    allowedRoles: ["TECHNICIAN"],
  },
  {
    label: "Maintenance Schedules",
    path: "/maintenance/schedules",
    allowedRoles: ["ADMIN", "MANAGER"],
  },
];
