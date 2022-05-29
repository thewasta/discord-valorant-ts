import high from "./high";
import low from "./low";
import medium from "./medium";
import {DoneCallback, Job, JobOptions} from "bull";

interface iJob {
    key: string,
    options?: JobOptions,

    onComplete?(job: Job, result: any): void

    onError?(job: Job, error: Error): void

    handle(job: Job, done: DoneCallback): void
}

interface iJobs {
    [key: string]: iJob;
}

/**
 * Add each job file as key:value of object
 * */
export const jobs: iJobs = {
    high,
    medium,
    low
};
