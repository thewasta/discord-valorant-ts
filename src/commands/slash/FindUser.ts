import {Command} from "../../Command";
import {BaseCommandInteraction, Client, Collection, Constants, GuildMember, User} from "discord.js";
import {queue} from "../../queue/queue";
import utils from "../../util/utils";

const FindUser: Command = {
    name: "find",
    type: "CHAT_INPUT",
    description: "Find user details by GameName#Tag, and check stats from last 15 competitive games",
    options: [
        {
            name: "by",
            description: "Select option",
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: "valorant",
                    description: "Find player by Valorant#Tag",
                    type: Constants.ApplicationCommandOptionTypes.STRING
                },
                {
                    name: "discord",
                    description: "Find player by Discord (only if already added)",
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const guildId = interaction.guildId as string;
        const interactionOptionDiscordUser = interaction.options.getUser("discord");
        const interactionOptionValorantUser = interaction.options.get("valorant");

        if (interactionOptionValorantUser && interactionOptionDiscordUser) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("errors.find_user_options_filled", guildId)
            });
            return;
        }
        let payload;
        let interactionUserName;
        if (interactionOptionValorantUser) {
            const valorantUser = interactionOptionValorantUser.value as string;
            interactionUserName = valorantUser;
            payload = {
                tagLine: valorantUser.split("#")[1],
                gameName: valorantUser.split("#")[0]
            };
        } else {
            interactionUserName = interactionOptionDiscordUser?.tag;
            payload = {
                targetUser: interactionOptionDiscordUser?.id
            };
        }

        await queue.add("medium", {
            guild: guildId,
            command: {
                name: "find-user",
                by: {
                    userId: interaction.user.id,
                    user: interaction.user.tag
                }
            },
            channel: interaction.channelId,
            payload
        });

        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.find_user", guildId, interactionUserName)
        });
    }
};

export default FindUser;