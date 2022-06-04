import {Schema, model} from "mongoose";

interface ITiers {
    tier: number;
    tierName: string;
    division: string;
    smallIcon: string;
    largeIcon: string;
    rankTriangleDownIcon: string;
    rankTriangleUpIcon: string;
}

interface ICompetitiveTier {
    uuid: string;
    assetObjectName: string;
    tiers: ITiers[];
}

const competitiveTierSchema = new Schema<ICompetitiveTier>({
    uuid: {
        type: String,
        required: true
    },
    assetObjectName: {
        type: String,
        required: true
    },
    tiers: {
        type: [], required: true
    }
}, {
    timestamps: true
});

export default model<ICompetitiveTier>("competiveTier", competitiveTierSchema);