import {Client} from "discord.js";
import {queue} from "../../queue/queue";

export default (client: Client): void => {
    client.on("guildMemberRemove", async (member) => {
        await queue.add("medium", {
            guild: member.guild.id as string,
            command: {
                by: {
                    user: member.user.tag,
                    userId: member.user.id
                },
                name: "member-remove"
            },
            payload: {
                user: member.user.tag,
                userId: member.user.id
            }
        });
    });

}