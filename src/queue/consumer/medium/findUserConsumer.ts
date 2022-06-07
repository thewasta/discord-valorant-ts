import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {Valorant} from "../../../lib/valorant/ValorantApi";
import {client} from "../../../Bot";
import utils from "../../../util/utils";
import ValoranUserMatchList from "../../../database/models/valoranUserMatchList";
import {queue} from "../../queue";
import app from "../../../config/app";
import {MatchDetails} from "../../../util/types/Api/MatchDetails";
import {EmbedFieldData, MessageEmbed} from "discord.js";
import {IValorantUserDetails} from "../../../database/models/valorantUserDetails";
import MatchDetailsSchema from "../../../database/models/matchDetailsSchema";
import {Character} from "../../../util/types/Enums/Character";
import AgentSchema from "../../../database/models/agentSchema";

export default async function (payload: iPayload, done: DoneCallback) {

    let targetUserData: IValorantUserDetails;
    const channel = await client.channels.fetch(payload.channel as string);
    try {
        if (payload.payload.targetUser) {

            const target = await utils.findPuuidInMongo(payload);
            if (!target) {
                if (channel?.isText()) {
                    await channel.send(utils.translate("messages.find_user_target_not_found", payload.guild));
                }
                return;
            } else {
                targetUserData = target;
            }
        } else {
            targetUserData = await utils.getUserPuuid(payload);
        }
    } catch (e: any) {
        console.log(e);
        if (channel?.isText()) {
            channel.send(utils.translate("errors.find_user_not_found", payload.guild));
        }
        done(new Error(e.stackTrace), payload);
        return;
    }

    const matchHistory = await getUserMatchHistory(targetUserData.puuid);
    let matches = [];
    const totalGames = matchHistory.history.length;
    let stats: { kill: number, deaths: number, assists: number }[] = [];
    let agents: Character[] = [];
    let fields: EmbedFieldData[] = [];
    for (const match of matchHistory.history) {
        const details = await getMatchDetails(match.matchId);
        if (details.matchInfo.isRanked) {
            const player = details.players.find(player => player.puuid === targetUserData.puuid);
            const matchDateToString = () => {
                const date = new Date(details.matchInfo.gameStartMillis);
                return `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}`;
            };
            const playTime = () => {
                let seconds: string | number = Math.floor((details.matchInfo.gameLengthMillis / 1000) % 60),
                    minutes: string | number = Math.floor((details.matchInfo.gameLengthMillis / (1000 * 60)) % 60),
                    hours: string | number = Math.floor((details.matchInfo.gameLengthMillis / (1000 * 60 * 60)) % 24);
                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                if (hours !== "00") {
                    return hours + ":" + minutes + ":" + seconds;
                }
                return minutes + ":" + seconds;
            };
            if (player) {
                const characterName = await AgentSchema.findOne({
                    uuid: player.characterId
                });
                if (!characterName) break;
                fields.push({
                    name: `${utils.translate("messages.find_user_match", payload.guild, matchDateToString())} Playtime: ${playTime()}`,
                    inline: false,
                    value: `${characterName.displayName} ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}`
                });
                agents.push(player.characterId);
            }
        }
    }
    const mostPlayedAgent = utils.getMostRepeated(agents);
    const getAgentThumbnail = await AgentSchema.findOne({
        uuid: mostPlayedAgent
    });
    const embed = new MessageEmbed();
    embed
        .setThumbnail(`attachment://icon_kill_feed.png` || "")
        .setURL(`https://tracker.gg/valorant/profile/riot/${targetUserData.gameName + "%23" + targetUserData.tagLine}/overview`)
        .setTitle(utils.translate("messages.find_user_embed_title", payload.guild, `${targetUserData.gameName}#${targetUserData.tagLine}`))
        .addFields(fields.slice(0, 15));
    if (channel?.isText()) {
        await channel.send({
            target: payload.payload.targetUser,
            embeds: [embed, embed],
            files: [
                getAgentThumbnail?.killfeedPortrait || getAgentThumbnail?.displayIcon || ""
            ]
        });
    }
    done(null, {
        ...payload
    });
}

async function getMatchDetails(matchId: string): Promise<MatchDetails> {
    const mongoMatchDetails = await MatchDetailsSchema.findOne({
        "matchInfo.matchId": matchId
    });
    if (!mongoMatchDetails) {
        await sendToQueueMatch(matchId);
        const valorantMatch = (await Valorant.instance().Match.getMatchById(matchId)).data;
        await MatchDetailsSchema.create(valorantMatch);
        return valorantMatch;
    } else {
        console.log(`${matchId} found`);
    }
    return mongoMatchDetails;
}

async function getUserMatchHistory(puuid: string) {
    const toCompare = new Date(Date.now() - app.UPDATE_HISTORY_MINUTES * app.MS_IN_MINUTE);
    const mongo = await ValoranUserMatchList.findOne({
        puuid: puuid
    });

    if (mongo) {
        const lastGame = new Date(mongo.history[0].gameStartTime);
        if (lastGame > toCompare) {
            await sendToQueueUpdate(puuid);
        }
        return mongo;
    } else {
        await sendToQueueUpdate(puuid);
        return (await Valorant.instance().Match.getMatchListByPuuid(puuid)).data;
    }

}

async function sendToQueueMatch(matchId: string) {
    await queue.add("high", {
        command: {
            by: {
                user: "admin",
                userId: "UNKNOW"
            },
            name: "update-match"
        },
        payload: {
            matchId
        }
    });
}

async function sendToQueueUpdate(puuid: string) {
    await queue.add("high", {
        command: {
            by: {
                user: "admin",
                userId: "UNKNOW"
            },
            name: "update-user-history"

        },
        payload: {
            puuid
        }
    });
}