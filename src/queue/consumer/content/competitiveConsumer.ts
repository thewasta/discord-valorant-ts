import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {PublicApiContent} from "../../../lib/public/PublicApi";
import path from "node:path";
import axios from "axios";
import fs from "node:fs";
import CompetitiveTier from "../../../database/models/competitiveTier";

export default async function (payload:iPayload,done:DoneCallback){
    const absolutResourcePath = path.join(__dirname, "..", "..", "resources", "images");

    const request = await PublicApiContent.instance().competitive();

    const competitiveTiers = request.data.data;
    const absoluteTierPath = path.join(absolutResourcePath, "competitive");

    competitiveTiers.map(async (competitive: {
        uuid: string;
        assetObjectName: string;
        tiers: {
            tier: number;
            tierName: string;
            division: string;
            smallIcon: string;
            largeIcon: string;
            rankTriangleDownIcon: string;
            rankTriangleUpIcon: string;
        }[];
    }) => {
        competitive.tiers.map(async (tier) => {
            const imageSmallPath = path.join(absoluteTierPath, tier.tierName + "_small.png");
            const imageLargePath = path.join(absoluteTierPath, tier.tierName + "_large.png");
            if (tier.smallIcon) {
                const imageSmall = await axios.get(tier.smallIcon, {
                    responseType: "stream"
                });
                if (imageSmall.data) {
                    imageSmall.data.pipe(fs.createWriteStream(imageSmallPath));
                    tier.smallIcon = imageSmallPath;
                }
            }
            if (tier.largeIcon) {
                const imageLarge = await axios.get(tier.largeIcon, {
                    responseType: "stream"
                });
                if (imageLarge.data) {
                    imageLarge.data.pipe(fs.createWriteStream(imageLargePath));
                    tier.largeIcon = imageLargePath;
                }
            }
        });
        const isExist = await CompetitiveTier.findOne({uuid: competitive.uuid});
        if (isExist) {
            await CompetitiveTier.findOneAndUpdate({
                uuid: competitive.uuid
            }, {
                tiers: competitive.tiers
            });
        } else {
            await CompetitiveTier.create(competitive);
        }
    });

    done(null, "Finished");

}