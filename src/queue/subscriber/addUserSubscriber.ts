import {Job} from "bull";
import {iPayload} from "../consumer/iPayload";
import {client} from "../../Bot";
import utils from "../../util/utils";
import {AnyChannel} from "discord.js";

export default async function (job: Job, result: Error | any) {
    const data: iPayload = job.returnvalue;
    const channel: AnyChannel | null = await client.channels.fetch(data.channel as string);

    if (result instanceof Error) {
        const message = utils.translate("errors.request_failed", data.guild, data.payload.gameTag);
        if (channel?.isText()) {
            await channel.send(message);
        }
    } else {
        /**
         * Message key added from Consumer, but not needed in Payload interface
         * */
            //@ts-ignore
        const message = utils.translate(data.message, data.guild, data.payload.targetDiscordTag);
        if (channel?.isText()) {
            await channel.send(message);
        }
    }
}