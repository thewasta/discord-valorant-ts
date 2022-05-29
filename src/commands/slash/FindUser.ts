import {Command} from "../../Command";
import {BaseCommandInteraction, Client, Collection, Constants, GuildMember, User} from "discord.js";
import {queue} from "../../queue/queue";
import utils from "../../util/utils";

const FindUser: Command = {
    name: "find",
    description: "Find user details by GameName#Tag, and check stats from last 10 ranked games",
    options: [
        {
            name: "username",
            description: "Example: Username#EUW",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        },
        {
            name: "onlyranks",
            description: "Filter result by only rankeds (last 15 games, in 3 days)",
            type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
            required: false
        },
        {
            name: "games",
            description: "Want to filter last X games? Default: 10",
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: false
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const interactionUserName = interaction.options.get("username")?.value as string,
            interactionOnlyRanks = interaction.options.get("onlyranks")?.value as boolean,
            interactionNumberGames = interaction.options.get("games")?.value as number || 10,
            guildId = interaction.guildId as string;

        if (!interactionUserName.includes("#")) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("messages.add_user_error_username", guildId)
            });
            return;
        }

/*
        const guildMember: Collection<string, GuildMember> | undefined = await interaction.guild?.members?.search({
            query: "TheWasta"
        });

        console.log(guildMember?.first()?.user);*/

        await queue.add("medium", {
            command: {
                by: {
                    user: interaction.user.tag,
                    userId: interaction.user.id
                },
                name: "find"
            },
            guild: interaction.guildId as string,
            channel: interaction.channelId,
            payload: {
                gameName: interactionUserName.split("#")[0],
                tagLine: interactionUserName.split("#")[1],
                ranked: interactionOnlyRanks,
                games: interactionNumberGames
            }
        });

        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.find_user", guildId, interactionUserName)
        });
    }
};

export default FindUser;