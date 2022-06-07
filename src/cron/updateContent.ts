import {queue} from "../queue/queue";

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

export default function (cron: any): void {
    /**
     * At 05:30 on day-of-month 10.
     */
    cron.schedule("30 5 10 * *", async function () {
        // await queue.add("content-all");
    });
}