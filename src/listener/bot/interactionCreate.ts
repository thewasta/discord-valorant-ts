import {
    BaseCommandInteraction,
    Client,
    CommandInteraction,
    ContextMenuInteraction,
    Interaction,
    UserContextMenuInteraction
} from "discord.js";
import {Commands} from "../../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu())
            await handleSlashCommand(client, interaction);
    });
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction | ContextMenuInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);

    if (!command) {
        await interaction.followUp({content: "An error has occurred"});
        return;
    }
    await interaction.deferReply();
    //@ts-ignore
    command.run(client, interaction);
};