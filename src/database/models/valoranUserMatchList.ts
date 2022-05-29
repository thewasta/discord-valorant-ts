import {Schema, model} from "mongoose";
import {HistoryMatches} from "../../lib/valorant/types/match";

export interface IValorantUserMatchList {
    guild: string;
    ds_user_id: string;
    ds_user: string;
    puuid: string;
    matchList: HistoryMatches[];
}

const valorantUserMatchList = new Schema<IValorantUserMatchList>({
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
    matchList: {
        type: [], required: true
    }
}, {
    timestamps: true
});

export default model<IValorantUserMatchList>("UserMatchList", valorantUserMatchList);