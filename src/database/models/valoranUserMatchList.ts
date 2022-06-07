import {Schema, model} from "mongoose";
import {HistoryMatches} from "../../lib/valorant/types/match";

export interface IValorantUserMatchList {
    ds_user_id: string;
    puuid: string;
    lastUpdate: number,
    history: HistoryMatches[];
}

const valorantUserMatchList = new Schema<IValorantUserMatchList>({
    ds_user_id: {
        type: String, required: true
    },
    puuid: {
        type: String, required: true
    },
    history: {
        type: [
            {
                matchId: {
                    type: String,
                    required: true
                },
                gameStartTime: {
                    type: Number,
                    require: true
                },
                teamId: {
                    type: String,
                    required: true
                }
            }
        ], required: true
    },
    lastUpdate: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default model<IValorantUserMatchList>("matchhistory", valorantUserMatchList);