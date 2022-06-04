import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {Valorant} from "../../../lib/valorant/ValorantApi";
import {client} from "../../../Bot";
import utils from "../../../util/utils";

export default async function (payload: iPayload, done: DoneCallback) {

    const userPuuid: string = await utils.getUserPuuid(payload);
    const apiMatchListHistory = await Valorant.instance().Match.getMatchListByPuuid(userPuuid);
    let matches = [];
    const totalGames = apiMatchListHistory.history.length;
    for (const match of apiMatchListHistory.history) {
        matches.push(await Valorant.instance().Match.getMatchById(match.matchId));
    }
    const channel = await client.channels.fetch(payload.channel as string);
    if (channel?.isText()) {
        await channel.send(`Total games: ${totalGames}`);
    }
    //
    // await ValoranUserMatchList.create({
    //     puuid: userPuuid,
    //     guild: payload.guild,
    //     matchList: apiMatchListHistory.history,
    //     ds_user: payload.payload.gameName
    // });
    done(null, {
        ...payload
    });
}