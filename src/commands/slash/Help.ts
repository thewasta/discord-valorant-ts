import {BaseCommandInteraction, Client} from "discord.js";
import {Command} from "../../Command";
import utils from "../../util/utils";

const Help: Command = {
    name: "help",
    description: utils.translate("commands.help"),
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = utils.translate("messages.help_description", interaction.guildId || "");
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
export default Help;