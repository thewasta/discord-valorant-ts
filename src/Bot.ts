import path from "path";

import {Client} from "discord.js";
import {config} from "dotenv";
import ready from "./listener/bot/ready";
import interactionCreate from "./listener/bot/interactionCreate";
import {queue} from "./queue/queue";
import {MongoDataBase} from "./config/mongoDataBase";

const db = new MongoDataBase();

db.init().catch(err => console.log(err));
config({
    path: path.join(__dirname, "..", ".env")
});
const token = process.env.TOKEN;

export const client: Client = new Client({
    intents: []
});
queue.process();
ready(client);
interactionCreate(client);

client.login(token);