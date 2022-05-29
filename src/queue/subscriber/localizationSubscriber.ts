import {Job} from "bull";
import {iPayload} from "../consumer/iPayload";
import {client} from "../../Bot";
import utils from "../../util/utils";

/**
 * Error not handled: Mongo is down or connection error
 * */
export default async function (job: Job, _: Error | any) {
    const data: iPayload = job.data;
    const channel = await client.channels.fetch(data.channel as string);
    const transMessage = utils.translate("messages.localization_configured", data.guild);
    const message = transMessage.replace("_REPLACE_", data.payload.gameTag);
    //@ts-ignore
    channel?.send(message);
}