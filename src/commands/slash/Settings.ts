import {Command} from "../../Command";
import {BaseCommandInteraction, Client, Constants, Guild} from "discord.js";
import utils from "../../util/utils";
import ServerSchema from "../../database/models/serverSchema";

const Settings: Command = {
    name: "settings",
    description: utils.translate("commands.settings"),
    type: "CHAT_INPUT",
    options: [
        {
            name: "channel",
            description: "Config channel, where ranking will be exposed",
            type: Constants.ApplicationCommandOptionTypes.CHANNEL,
            required: true
        },
        {
            name: "admin",
            description: "ROLE to administrate bot",
            type: Constants.ApplicationCommandOptionTypes.ROLE,
            required: true
        },
        {
            name: "guest",
            description: "ROLE to use /adduser, /finduser commands",
            type: Constants.ApplicationCommandOptionTypes.ROLE,
            required: true
        },
        {
            name: "language",
            description: "Bot lang",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        const guildId = interaction.guildId as string;
        const owner = await interaction.guild?.fetchOwner();

        if (owner && owner.id !== interaction.user.id) {
            console.log("not owner");
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("erros.settings_not_owner", guildId)
            });
            return;
        }

        const optionChannel = interaction.options.get("channel")?.channel;
        const optionAdminRole = interaction.options.get("admin")?.role;
        const optionGuestRole = interaction.options.get("guest")?.role;
        const optionLang = interaction.options.get("language")?.value;
        if (optionChannel?.type !== "GUILD_TEXT") {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("errors.settings_channel", guildId)
            });
            return;
        }

        if (optionAdminRole?.id === optionGuestRole?.id) {
            await interaction.followUp({
                ephemeral: true,
                content: utils.translate("errors.settings_role", guildId)
            });
            return;
        }

        const server = await ServerSchema.findOne({
            guild: guildId
        });
        if (server) {
            await ServerSchema.updateOne({
                guild: guildId
            }, {
                ...(optionLang ? {lang: optionLang} : {}),
                channel: optionChannel.id,
                adminRole: optionAdminRole?.id,
                guestRole: optionGuestRole?.id,
                configured: true
            });
        } else {
            await ServerSchema.create({
                guild: guildId,
                lang: optionLang ? optionLang : "eng",
                channel: optionChannel.id,
                configured: true,
                adminRole: optionAdminRole?.id,
                guestRole: optionGuestRole?.id
            });
        }

        await interaction.followUp({
            ephemeral: true,
            content: utils.translate("messages.settings_success", guildId)
        });
    }
};

export default Settings;