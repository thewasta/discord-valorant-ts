import {DoneCallback, Job} from "bull";
import localization from "../consumer/low/localizationConsumer";
import localizationSubscriber from "../subscriber/localizationSubscriber";

export default {
    key: "low",
    async onComplete(job: Job, result: any): Promise<void> {
        switch (job.data.command.name) {
            case "localization":
                await localizationSubscriber(job, result);
        }
    },
    async handle(job: Job, done: DoneCallback) {
        switch (job.data.command.name) {
            case "localization":
                await localization(job.data, done);
        }
    }
};