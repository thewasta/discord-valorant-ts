import {Schema, model} from "mongoose";

interface ILeaderBoard {
    puuid: string;
    gameName: string;
    tagLine: string;
    leaderboardRank: number;
    rankedRating: number;
    numberOfWins: number;
}

const leaderboardSchema = new Schema<ILeaderBoard>({
    puuid: {
        type: String,
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    tagLine: {
        type: String,
        required: true
    },
    leaderboardRank: {
        type: Number,
        required: true
    },
    rankedRating: {
        type: Number,
        required: true
    },
    numberOfWins: {
        type: Number,
        required: true
    }
});

export default model<ILeaderBoard>("leaderboard", leaderboardSchema);