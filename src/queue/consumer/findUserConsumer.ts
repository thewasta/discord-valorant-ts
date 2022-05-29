import {iPayload} from "./iPayload";
import {DoneCallback} from "bull";
import ValorantUserDetails, {IValorantUserDetails} from "../../database/models/ValorantUserDetails";
import {Valorant} from "../../lib/valorant/ValorantApi";
import {Account} from "../../lib/account/AccountApi";
import {client} from "../../Bot";
import ValoranUserMatchList from "../../database/models/valoranUserMatchList";

export default async function (payload: iPayload, done: DoneCallback) {
    const userPuuid: string = await getUserPuuid(payload);
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

async function findPuuidInMongo(payload: iPayload): Promise<IValorantUserDetails | null> {
    return ValorantUserDetails.findOne({
        gameName: payload.payload.gameName,
        tagLine: payload.payload.tagLine
    });
}

async function getUserPuuid(payload: iPayload): Promise<string> {
    const findInMongo = await findPuuidInMongo(payload);
    if (!findInMongo){
        await ValorantUserDetails.create({

        })
    }
    return findInMongo ? findInMongo.puuid : (await Account.instance().profile(payload.payload.gameName, payload.payload.tagLine)).data.puuid;
}

async function findUserInDiscordClient(discordUsername: string) {
    const user = await ValorantUserDetails.find({
        ds_user: discordUsername
    });

}