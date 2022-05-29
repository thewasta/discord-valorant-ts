import {Client} from "discord.js";
import {Commands} from "../../Commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) return;
        await client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: "Moderating server 🔥",
                    type: "WATCHING"
                }
            ]
        });

        await client.application.commands.set(Commands);
        console.log(`${client.user.tag} is Online`);
    });
}