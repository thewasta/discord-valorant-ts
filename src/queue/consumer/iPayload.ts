import {Client} from "discord.js";
import {iCommand} from "../queue";

export interface iPayload {
    client: Client,
    channel?: string;
    command: iCommand,
    guild?: string;
    dsUser?: string
    dsUserId?: string
    payload?: any;
}