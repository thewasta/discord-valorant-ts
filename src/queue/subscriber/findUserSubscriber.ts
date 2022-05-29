import {Job} from "bull";
import {client} from "../../Bot";
import {iPayload} from "../consumer/iPayload";
import utils from "../../util/utils";

export default async function (job: Job, _: Error | any) {
    const data: iPayload = job.data;

    const channel = await client.channels.fetch(data.channel as string);
    const message = utils.translate("messages.find_user_finished", data.guild, data.payload.gameName);
    //@ts-ignore
    channel?.send(message);
}