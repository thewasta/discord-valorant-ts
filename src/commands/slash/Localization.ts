import {BaseCommandInteraction, Client, Constants} from "discord.js";
import {Command} from "../../Command";
import utils from "../../util/utils";
import {queue} from "../../queue/queue";

const Localization: Command = {
    name: "localization",
    description: "Set bot language. Available: ENG, ESP",
    type: "CHAT_INPUT",
    options: [
        {
            name: "locale",
            description: utils.translate("commands.localization"),
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const guildId = interaction.guildId || "";
        const interactionOptionValue = interaction.options.get("locale");
        let content: string;
        if (interactionOptionValue?.value === "es" || interactionOptionValue?.value === "eng") {
            content = utils.translate("messages.localization_config_init", guildId);
            await queue.add("low", {
                command: "localization",
                channel: interaction.channelId,
                guild: interaction.guildId as string,
                payload: {
                    lang: interactionOptionValue.value
                }
            });
        } else {
            content = utils.translate("messages.locale_config_error", guildId);
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
export default Localization;
