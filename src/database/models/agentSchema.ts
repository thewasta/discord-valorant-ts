import {Schema, model} from "mongoose";

interface IAgent {
    uuid: string;
    displayName: string;
    displayIcon: string;
    displayIconSmall: string;
    bustPortrait: string;
    fullPortrait: string;
    fullPortraitV2: string;
    killfeedPortrait: string;
    role: {
        displayName: string
        displayIcon: string
    };
}

const agentSchema = new Schema<IAgent>({
    uuid: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    displayIcon: {
        type: String,
        required: false
    },
    displayIconSmall: {
        type: String,
        required: false
    },
    bustPortrait: {
        type: String,
        required: false
    },
    fullPortrait: {
        type: String,
        required: false
    },
    fullPortraitV2: {
        type: String,
        required: false
    },
    killfeedPortrait: {
        type: String,
        required: false
    },
    role: {
        displayName: {
            type: String,
            require: true
        },
        displayIcon: {
            type: String,
            required: false
        }
    }
}, {timestamps: true});

export default model<IAgent>("agent", agentSchema);