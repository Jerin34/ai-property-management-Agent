import mongoose, { Schema } from "mongoose";
export interface IProperty {
  name: String;
  address: {
    street: string;
    city: string;
    state: string;
    postalcode: string;
    country: string;
  };
  manager: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
}

const propertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true, trim: true },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalcode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    manager: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const Property = mongoose.model<IProperty>("property", propertySchema);
export default Property;
