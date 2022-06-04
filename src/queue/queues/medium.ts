import {DoneCallback, Job} from "bull";
import findUserConsumer from "../consumer/medium/findUserConsumer";
import findUserSubscriber from "../subscriber/findUserSubscriber";
import memberRemoveConsumer from "../consumer/medium/memberRemoveConsumer";

export default {
    key: "medium",
    async onComplete(job: Job, result: any) {
        switch (job.data.command.name) {
            case "find":
                await findUserSubscriber(job, result);
                break;
        }
    },
    async handle(job: Job, done: DoneCallback) {
        switch (job.data.command.name) {
            case "find":
                await findUserConsumer(job.data, done);
                break;
            case "member-remove":
                await memberRemoveConsumer(job.data, done);
        }
    }
};