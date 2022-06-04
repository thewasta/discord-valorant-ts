import {
    BaseCommandInteraction,
    ChatInputApplicationCommandData,
    Client, MessageApplicationCommandData, MessageContextMenuInteraction,
    UserApplicationCommandData, UserContextMenuInteraction
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}

export interface Context extends UserApplicationCommandData {
    run: (client: Client, interaction: UserContextMenuInteraction) => void;
}

export interface MessageContext extends MessageApplicationCommandData {
    run: (client: Client, interaction: MessageContextMenuInteraction) => void;
}