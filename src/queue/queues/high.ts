import {DoneCallback, Job} from "bull";
import AddUser from "../consumer/high/addUserConsumer";
import AddUserSubscriber from "../subscriber/addUserSubscriber";

export default {
    options: {
        delay: 1500
    },
    key: "high",
    async onComplete(job: Job, result: any) {
        switch (result.command.name) {
            case "adduser":
                await AddUserSubscriber(job, result);
        }
    },
    async onError(job: Job, error: Error) {
        switch (job.data.command.name) {
            case "adduser":
                await AddUserSubscriber(job, error);
                break
        }
    },
    async handle(job: Job, done: DoneCallback) {
        switch (job.data.command.name) {
            case "find-user":
                break;
            case "adduser":
                await AddUser(job.data, done);
        }
    }
};