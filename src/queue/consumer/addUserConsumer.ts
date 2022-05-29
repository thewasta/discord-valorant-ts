import {iPayload} from "./iPayload";
import {DoneCallback} from "bull";
import {Account} from "../../lib/account/AccountApi";
import ValorantUserDetails from "../../database/models/valorantUserDetails";

export default async function (payload: iPayload, done: DoneCallback) {
    if (!payload.payload.targetDiscordID || !payload.payload.targetDiscordTag) {
        done(new Error(`Discord user not found: ${payload.payload.targetDiscordTag}`), payload);
        return;
    }
    const {gameName, tagLine} = payload.payload;
    const filter = {
        gameName: gameName,
        tagLine: tagLine
    };

    /***
     * Find user tag in mongo database
     */
    const findUserByGameNick = await ValorantUserDetails.find(filter);

    if (!findUserByGameNick) {
        try {
            /**
             * Find user with Riot API
             * */
            const riotAccount = await Account.instance().profile(gameName, tagLine);
            const requestData = riotAccount.data;
            /**
             * Find user in mongo by PUUID
             * */
            try {
                const findUserByPuuid = await ValorantUserDetails.findOne({
                    puuid: requestData.puuid
                });
                if (!findUserByPuuid) {
                    await ValorantUserDetails.create({
                        puuid: requestData.puuid,
                        tagLine,
                        gameName,
                        ds_user: payload.payload.targetDiscordTag,
                        ds_user_id: payload.payload.targetDiscordID,
                        guild: payload.guild
                    });
                }
            } catch (e) {
                done(new Error("Couldn't make request to MongoDB, Valorant User Details"), payload);
            }
        } catch (e) {
            done(new Error("Couldn't make request to Riot API"), payload);
        }

        done(null, payload);
    } else if (findUserByGameNick.length > 2) {

    }

    done(null, payload);
}