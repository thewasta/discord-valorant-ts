import path from "path";
import Language from "../config/language";
import fs from "fs";
import {iPayload} from "../queue/consumer/iPayload";
import ValorantUserDetails, {IValorantUserDetails} from "../database/models/valorantUserDetails";
import {Account} from "../lib/account/AccountApi";
import {client} from "../Bot";
import {AxiosResponse} from "axios";
import {GuildMember, User} from "discord.js";

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
            $or: [
                {
                    gameName: payload.payload.gameName,
                    tagLine: payload.payload.tagLine
                },
                {
                    ds_user_id: payload.payload.targetUser
                }
            ]

        });
    },
    findUserValorant: async function (nickName: string, tagLine: string): Promise<AxiosResponse> {
        try {
            return await Account.instance().profile(nickName, tagLine);
        } catch (e) {
            throw new Error("User not found: " + nickName + "#" + tagLine);
        }
    },
    getUserPuuid: async function (payload: iPayload): Promise<IValorantUserDetails> {
        const findInMongo = await this.findPuuidInMongo(payload);
        if (!findInMongo) {
            let member: GuildMember;
            if (payload.payload.targetUser) {
                const guildData = await client.guilds.fetch(payload.guild || "");
                member = await guildData.members.fetch(payload.payload.targetUser);
            } else {

            }

            const valorantProfile = await this.findUserValorant(payload.payload.gameName, payload.payload.tagLine);
            console.log(valorantProfile.data);
            await ValorantUserDetails.create({
                ...valorantProfile.data,
                ds_user_id: payload.payload
            });
        }

        return findInMongo ? findInMongo : (await Account.instance().profile(payload.payload.gameName, payload.payload.tagLine)).data;
    },
    getMostRepeated(array: any []) {
        if (array.length === 0) return;
        let uniques = {}, max = 0, res;
        for (let v in array) {
            //@ts-ignore
            uniques[array[v]] = (uniques[array[v]] || 0) + 1;
            //@ts-ignore
            if (uniques[array[v]] > max) {
                //@ts-ignore
                max = uniques[array[v]];
                res = array[v];
            }
        }
        let results = [];
        for (const k in uniques) {
            //@ts-ignore
            if (uniques[k] == max) {
                results.push(k);
            }
        }
        return results;
    }
};
