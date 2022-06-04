import path from "path";
import Language from "../config/language";
import fs from "fs";
import {iPayload} from "../queue/consumer/iPayload";
import ValorantUserDetails, {IValorantUserDetails} from "../database/models/valorantUserDetails";
import {Account} from "../lib/account/AccountApi";
import {client} from "../Bot";

export default {
    translate: function (s: string, guild?: string, replace?: string): string {
        const split = s.split(".");
        const file = split[0];
        const keys = split.slice(1);
        const absoluteLangPath = path.join(__dirname, "..", "resources", "lang", Language.getInstance().lang(guild), file + ".json");
        //@ts-ignore
        const json = JSON.parse(fs.readFileSync(absoluteLangPath));

        return json[keys[0]] ? json[keys[0]].replace("_REPLACE_", replace) : `${keys.join(".")}`;
    },
    findPuuidInMongo: async function (payload: iPayload): Promise<IValorantUserDetails | null> {
        return ValorantUserDetails.findOne({
            gameName: payload.payload.gameName,
            tagLine: payload.payload.tagLine
        });
    },
    findUserValorant: async function (nickName: string, tagLine: string): Promise<{ puuid: string, gameName: string, tagLine: string } | undefined> {
        const request = await Account.instance().profile(nickName, tagLine);

        return request.data;
    },
    getUserPuuid: async function (payload: iPayload): Promise<string> {
        const findInMongo = await this.findPuuidInMongo(payload);
        if (!findInMongo) {
            const valorantProfile = await this.findUserValorant(payload.payload.gameName, payload.payload.tagLine);
            const userDiscord = await client.users.fetch("");
            await ValorantUserDetails.create({});
        }

        return findInMongo ? findInMongo.puuid : (await Account.instance().profile(payload.payload.gameName, payload.payload.tagLine)).data.puuid;
    }
};
