import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import localDatabase from "../../../config/localDatabase";
import {Server} from "../../../util/types/App/Server";
import ServerSchema from "../../../database/models/serverSchema";

export default async function (payload: iPayload, done: DoneCallback) {
    /**
     * Find and update in mongo database
     */
    const filter = {guild: payload.guild};
    const findServerMongo = await ServerSchema.findOne(filter);
    if (findServerMongo) {
        await ServerSchema.updateOne(filter, {lang: payload.payload.lang});
    } else {
        const server = await ServerSchema.create({
            guild: payload.guild,
            lang: payload.payload.lang,
            configured: false
        });

        await server.save();
    }

    /**
     * Find and update in local json
     * */
    const raw = localDatabase.get("server").value();
    let localDataServerIndex = null;
    raw.find(function (server: Server, index: number) {
        localDataServerIndex = index;
    });

    if (localDataServerIndex) {
        localDatabase.get("server").get(localDataServerIndex).get("lang").set(payload.payload.lang);
        localDatabase.save();
    } else {
        localDatabase.get("server").push({
            guild: payload.guild,
            lang: payload.payload.lang
        });
        localDatabase.save();
    }
    done(null);
}