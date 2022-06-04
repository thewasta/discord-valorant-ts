import path from "path";
import cron from "node-cron";
import {Client, Intents} from "discord.js";
import {config} from "dotenv";
import ready from "./listener/bot/ready";
import interactionCreate from "./listener/bot/interactionCreate";
import {queue} from "./queue/queue";
import {MongoDataBase} from "./config/mongoDataBase";
import updateContent from "./cron/updateContent";
import messageCreated from "./listener/bot/messageCreated";

const db = new MongoDataBase();

db.init().catch(err => console.log(err));
config({
    path: path.join(__dirname, "..", ".env")
});
const token = process.env.TOKEN;

export const client: Client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: [
        "GUILD_MEMBER"
    ]
});
queue.process();
ready(client);
interactionCreate(client);
updateContent(cron);
messageCreated(client);
client.login(token);