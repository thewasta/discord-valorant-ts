import {Command} from "../../Command";
import {BaseCommandInteraction, Client, Constants} from "discord.js";
import utils from "../../util/utils";
import {queue} from "../../queue/queue";

/**
 * Add user to ranking
 * */
const AddUser: Command = {
    name: "add",
    description: utils.translate("commands.add_user"),
    options: [
        {
            name: "username",
            description: "Example: UserName#EUW",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const userGameID: string = interaction.options.get("username")?.value as string;

        if (!userGameID.includes("#")) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("messages.add_user_error_username", interaction.guildId || "")
            });
            return;
        }

        await queue.add("high", {
            guild: interaction.guildId || "",
            channel: interaction.channelId,
            command: "adduser",
            payload: {
                gameName: userGameID.split("#")[0],
                tagLine: userGameID.split("#")[1]
            },
            dsUser: interaction.user.tag,
            dsUserId: interaction.user.id
        });

        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.add_user", interaction.guildId || "")
        });
    }
};

export default AddUser;