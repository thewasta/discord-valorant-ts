import {Schema, model} from "mongoose";

interface IServer {
    guild: string;
    lang: string;
    configured: boolean;
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
            required: true
        }

    },
    {
        timestamps: true
    });

export default model<IServer>("Server", serverSchema);