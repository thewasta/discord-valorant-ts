import {Context} from "../../Command";
import {Client, ContextMenuInteraction} from "discord.js";
import utils from "../../util/utils";
import {queue} from "../../queue/queue";

const FindUser: Context = {
    name: "val-profile",
    type: "USER",
    run: async (client: Client, interaction: ContextMenuInteraction) => {
        const guildId = interaction.guildId as string;
        const channelId = interaction.channelId;
        const user = await client.guilds.client.users.fetch(interaction.targetId);
        if (user.bot) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("messages.im_bot", guildId)
            });
            return;
        }
        await queue.add("medium", {
            guild: guildId,
            channel: channelId,
            command: {
                name: "context-find",
                by: {
                    user: interaction.user.tag,
                    userId: interaction.user.id
                }
            },
            payload: {
                targetId: user.id
            }
        });
        await interaction.followUp({
            ephemeral: true,
            content: "messages.find_user"
        });
    }
};

export default FindUser;