import {iPayload} from "./iPayload";
import {DoneCallback} from "bull";
import ValorantUserDetails from "../../database/models/ValorantUserDetails";
import {Account} from "../../lib/Account/AccountApi";

export default async function (payload: iPayload, done: DoneCallback) {

    const filter = {
        gameName: payload.payload.gameName,
        tagLine: payload.payload.tagLine
    };
    const {gameName, tagLine} = payload.payload;
    /***
     * Find user tag in mongo database
     */
    const findUserByGameNick = await ValorantUserDetails.findOne(filter);
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
            const findUserByPuuid = await ValorantUserDetails.findOne({
                puuid: requestData.puuid
            });
            if (!findUserByPuuid) {
                await ValorantUserDetails.create({
                    puuid: requestData.puuid,
                    tagLine,
                    gameName,
                    ds_user: payload.dsUser,
                    ds_user_id: payload.dsUserId,
                    guild: payload.guild
                });
            }
        } catch (e) {
            done(new Error("Couldn't make request to Riot API"), payload);
        }

        done(null, payload);
    }

    done(new Error("User already added"), payload);
}