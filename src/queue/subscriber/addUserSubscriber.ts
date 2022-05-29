import {Job} from "bull";
import {iPayload} from "../consumer/iPayload";
import {client} from "../../Bot";
import utils from "../../util/utils";

export default async function (job: Job, result: Error | any) {
    const data: iPayload = job.data;
    const channel = await client.channels.fetch(data.channel as string);

    if (result instanceof Error) {
        const transMessage = utils.translate("messages.game_tag_not_found", data.guild);
        const message = transMessage.replace("_REPLACE_", data.payload.gameTag);
        //@ts-ignore
        channel?.send(message);
    } else {
        const transMessage = utils.translate("messages.add_user_successfully", data.guild);
        const message = transMessage.replace("_REPLACE_", data.payload.gameTag);
        //@ts-ignore
        channel?.send(message);
    }
}