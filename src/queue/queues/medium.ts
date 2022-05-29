import {DoneCallback, Job} from "bull";
import findUserConsumer from "../consumer/findUserConsumer";
import findUserSubscriber from "../subscriber/findUserSubscriber";

export default {
    key: "medium",
    async onComplete(job: Job, result: any) {
        switch (job.data.command.name) {
            case "find":
                await findUserSubscriber(job, result);
        }
    },
    async handle(job: Job, done: DoneCallback) {
        switch (job.data.command.name) {
            case "find":
                await findUserConsumer(job.data, done);
        }
    }
};