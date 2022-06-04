import {Command} from "../../Command";
import {BaseCommandInteraction, Client, Constants, GuildMember, User} from "discord.js";
import utils from "../../util/utils";
import {queue} from "../../queue/queue";

/**
 * Add user to ranking
 * */
const AddUser: Command = {
    name: "add",
    type: "CHAT_INPUT",
    description: utils.translate("commands.add_user"),
    options: [
        {
            name: "username",
            description: "Example: QuizásTeInsulto#EUW",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        },
        {
            name: "target",
            description: "Discord user target. If empty, target will be you",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: false
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const userGameID: string = interaction.options.get("username")?.value as string;
        let discordUserTarget: User | null = interaction.options.getUser("target");
        if (!userGameID.includes("#")) {
            await ensureValorantProfile(interaction);
            return;
        }

        if (!discordUserTarget) {
            discordUserTarget = interaction.user;
        }

        const sendQueue = await sendToQueue(interaction, userGameID, discordUserTarget);

        if (!sendQueue) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("errors.add_user_not_found", interaction.guildId || "", discordUserTarget.tag)
            });
            return;
        }
        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.add_user", interaction.guildId || "")
        });
    }
};

async function ensureValorantProfile(interaction: BaseCommandInteraction) {
    await interaction.followUp({
        ephemeral: true,
        content: utils.translate("errors.add_user_error_username", interaction.guildId || "")
    });
}

async function sendToQueue(interaction: BaseCommandInteraction, userGameID: string, discordUserTarget: User): Promise<boolean> {

    await queue.add("high", {
        guild: interaction.guildId || "",
        channel: interaction.channelId,
        command: {
            by: {
                user: interaction.user.tag,
                userId: interaction.user.id
            },
            name: "adduser"
        },
        payload: {
            gameName: userGameID.split("#")[0],
            tagLine: userGameID.split("#")[1],
            targetDiscordTag: discordUserTarget.tag,
            targetDiscordID: discordUserTarget.id
        }
    });
    return true;

}

export default AddUser;