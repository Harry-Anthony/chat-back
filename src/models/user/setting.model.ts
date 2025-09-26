import mongoose, { model } from "mongoose";

interface ISetting {
    token: string
}

const SettingSchema = new  mongoose.Schema<ISetting>({
    token: {
        type: String,
        required: true
    }
});

export const SettingModel = model<ISetting>('Setting', SettingSchema);
