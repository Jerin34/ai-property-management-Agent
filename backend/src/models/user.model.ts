import mongoose, { Schema } from "mongoose";
import type { Role } from "../constants/roles.js";
import { ROLES } from "../constants/roles.js";

export interface IUserLocation {
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

export type TechnicianApplicationStatus =
  | "NOT_REQUESTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type TechnicianAvailability =
  | "FULL_TIME"
  | "PART_TIME"
  | "FLEXIBLE";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  skills?: string[];
  location?: IUserLocation;
  experienceYears?: number;
  serviceAreas?: string[];
  availability?: TechnicianAvailability;
  workingHours?: {
    start: string;
    end: string;
  };
  bio?: string;
  profileCompleted: boolean;
  technicianApplicationStatus: TechnicianApplicationStatus;
  technicianApplicationRequestedAt?: Date;
  technicianApprovedAt?: Date;
  technicianApprovedBy?: mongoose.Types.ObjectId;
  subscriptionStatus: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
  subscriptionId?: string;
  subscriptionCurrentPeriodEnd?: Date;
  roleApprovalStatus: "NOT_REQUESTED" | "PENDING" | "APPROVED" | "REJECTED";
  roleApprovalRequestedAt?: Date;
  roleApprovedAt?: Date;
  roleApprovedBy?: mongoose.Types.ObjectId;
  processedSubscriptionPaymentIds?: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.Tenant,
    },
    avatar: { type: String, trim: true },
    skills: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      updatedAt: { type: Date },
    },
    experienceYears: { type: Number, min: 0 },
    serviceAreas: { type: [String], default: [] },
    availability: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "FLEXIBLE"],
    },
    workingHours: {
      start: { type: String },
      end: { type: String },
    },
    bio: { type: String, trim: true, maxlength: 500 },
    profileCompleted: { type: Boolean, default: false },
    technicianApplicationStatus: {
      type: String,
      enum: ["NOT_REQUESTED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_REQUESTED",
    },
    technicianApplicationRequestedAt: { type: Date },
    technicianApprovedAt: { type: Date },
    technicianApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subscriptionStatus: {
      type: String,
      enum: ["INACTIVE", "ACTIVE", "PAST_DUE", "CANCELLED"],
      default: "INACTIVE",
    },
    subscriptionId: { type: String },
    subscriptionCurrentPeriodEnd: { type: Date },
    roleApprovalStatus: {
      type: String,
      enum: ["NOT_REQUESTED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_REQUESTED",
    },
    roleApprovalRequestedAt: { type: Date },
    roleApprovedAt: { type: Date },
    roleApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processedSubscriptionPaymentIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
