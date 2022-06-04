import {Schema, model} from "mongoose";

interface IServer {
    guild: string;
    lang: string;
    configured: boolean;
    channel: number;
    guestRole: number;
    adminRole: number;
}

const serverSchema = new Schema<IServer>({
        guild: {
            type: String,
            required: true
        },
        lang: {
            type: String,
            required: true
        },
        configured: {
            type: Boolean,
            default: false,
            required: true
        },
        channel: {
            type: Number,
            required: false
        },
        guestRole: {
            type: Number,
            required: false
        },
        adminRole: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    });

export default model<IServer>("Server", serverSchema);