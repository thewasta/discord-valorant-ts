import {DoneCallback, Job} from "bull";
import {AgentsConsumer, CompetitiveConsumer, MapsConsumer, WeaponsConsumer} from "../consumer/content";

export default {
    key: "content",
    async handle(job: Job, done: DoneCallback) {
        switch (job.data.command.name) {
            case "content-competitive":
                await CompetitiveConsumer(job.data, done);
                break;
            case "content-maps":
                await MapsConsumer(job.data, done);
                break;
            case "content-weapons":
                await WeaponsConsumer(job.data, done);
                break;
            case "content-agents":
                await AgentsConsumer(job.data, done);
                break;
            default:
                await CompetitiveConsumer(job.data, done);
                await MapsConsumer(job.data, done);
                await WeaponsConsumer(job.data, done);
                await AgentsConsumer(job.data, done);
                break;
        }
    }
};