import {Client, Message} from "discord.js";
import app from "../../config/app";
import {queue} from "../../queue/queue";

async function addQueue(command: string) {
    await queue.add("content", {
        command: {
            name: command,
            by: {
                user: "thewasta",
                userId: "null"
            }
        }
    });
}

export default (client: Client): void => {
    client.on("messageCreate", async function (message: Message) {
        if (message.author.bot) return;
        if (message.author.id !== app.AUTHOR_ID) return;
        if (!message.content.startsWith("!")) return;
        if (message.content.includes("updateContent")) {
            const msg = message.content;
            const action = msg.split(" ")[1];
            if (action.toLowerCase() === "competitive") {
                await addQueue("content-competitive");
            } else if (action.toLowerCase() === "maps") {
                await addQueue("content-maps");
            } else if (action.toLowerCase() === "weapons") {
                await addQueue("content-weapons");
            } else if (action.toLowerCase() === "agents") {
                await addQueue("content-agents");
            } else {
                await message.reply("Command not found");
            }
        }
    });
}