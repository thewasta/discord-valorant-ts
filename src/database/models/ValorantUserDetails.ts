import {Schema, model} from "mongoose";

interface IValorantUserDetails {
    "guild": string;
    "ds_user": string;
    "ds_user_id": string;
    "puuid": string;
    "gameName": string;
    "tagLine": string;
}

const valorantUserDetails = new Schema<IValorantUserDetails>({
        guild: {
            type: String, required: true
        },
        ds_user: {
            type: String, required: true
        },
        ds_user_id: {
            type: String, required: true
        },
        puuid: {
            type: String, required: true
        },
        gameName: {
            type: String, required: true
        },
        tagLine: {
            type: String, required: true
        }
    },
    {
        timestamps: true
    });

export default model<IValorantUserDetails>("ValoranUserDetails", valorantUserDetails);