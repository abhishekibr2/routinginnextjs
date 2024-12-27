import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    pageUrl: { type: String, unique: true },
    pageDescription: { type: String },
}, { timestamps: true });

export const Page =
    mongoose.models.page || mongoose.model("page", pageSchema);
