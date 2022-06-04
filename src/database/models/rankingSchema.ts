import {Schema, model} from "mongoose";

interface IUserRanking {
    puuid: string;
    discord_id: string;
}

interface IRanking {
    guild: string;
    users: IUserRanking[];
}

const rankingSchema = new Schema<IRanking>({
        guild: {
            type: String,
            required: true
        },
        users: {
            type: []
        }
    },
    {
        timestamps: true
    });

export default model<IRanking>("ranking", rankingSchema);