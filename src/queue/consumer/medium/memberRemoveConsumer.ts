import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import RankingSchema from "../../../database/models/rankingSchema";

export default async function (payload: iPayload, done: DoneCallback) {
    const findUser = await RankingSchema.find({
        users: {
            $elementMatch: {
                discord_id: payload.payload.userId
            }
        }
    });
    console.log(findUser);
}