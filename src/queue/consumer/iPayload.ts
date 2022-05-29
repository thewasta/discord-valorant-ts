import {Client} from "discord.js";

export interface iPayload {
    client: Client,
    channel?: string;
    command: string,
    guild?: string;
    dsUser?: string
    dsUserId?: string
    payload?: any;
}