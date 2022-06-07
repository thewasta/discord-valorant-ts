import {Schema, model} from "mongoose";
import {MatchDetails} from "../../util/types/Api/MatchDetails";

const matchDetailsSchema = new Schema<MatchDetails>({
    matchInfo: {
        type: Object,
        required: true
    },
    players: {
        type: [Object],
        required: true
    },
    teams: {
        type: [Object],
        required: true
    },
    roundsResults: {
        type: [Object],
        required: true
    }
}, {timestamps: true});

export default model<MatchDetails>("matchDetails", matchDetailsSchema);