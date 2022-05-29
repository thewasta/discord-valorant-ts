import {Command} from "../../Command";
import {BaseCommandInteraction, CacheType, Client, Constants, GuildMember, User} from "discord.js";
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
        },
        {
            name: "target",
            description: "Discord user target. Write Discord discriminator, example: TheWasta#7811. If not passed, your Discord profile will be linked",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const userGameID: string = interaction.options.get("username")?.value as string;
        let discordUserTarget: string = interaction.options.get("target")?.value as string;
        if (!userGameID.includes("#")) {
            await ensureValorantProfile(interaction);
        }
        if (!discordUserTarget.includes("#")) {
            await ensureDiscorTarget(interaction);
            return;
        }
        if (!discordUserTarget) {
            discordUserTarget = interaction.user.tag;
        }

        await sendToQueue(interaction, userGameID, discordUserTarget);

        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.add_user", interaction.guildId || "")
        });
    }
};

async function ensureValorantProfile(interaction: BaseCommandInteraction<CacheType>) {
    await interaction.followUp({
        ephemeral: true,
        content: utils.translate("messages.add_user_error_username", interaction.guildId || "")
    });
}

async function ensureDiscorTarget(interaction: BaseCommandInteraction<CacheType>) {
    await interaction.followUp({
        ephemeral: true,
        content: utils.translate("messages.add_user_discord_error", interaction.guildId || "")
    });
}

async function sendToQueue(interaction: BaseCommandInteraction<CacheType>, userGameID: string, discordUserTarget: string) {
    const findDiscordUser = async (): Promise<Promise<User> | undefined> => {
        const member = await interaction.guild?.members?.search({
            query: discordUserTarget
        });
        return member?.first()?.user;
    };
    const user = await findDiscordUser();

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
            targetDiscordTag: user?.tag,
            targetDiscordID: user?.id
        }
    });
}

export default AddUser;