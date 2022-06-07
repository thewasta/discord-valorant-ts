import Queue from "bull";
import {jobs} from "./queues";

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key,),
    name: job.key,
    handle: job.handle,
    options: job.options,
    onComplete: job.onComplete,
    onError: job.onError
}));

export interface iCommand {
    by: {
        user: string
        userId: string
    },
    name: string
}

interface iJobData {
    command: iCommand,
    channel?: string;
    guild?: string;
    payload?: any;
}

export const queue = {
    queues,
    /**
     * @param queueName The name of queue
     * @param data Data to pass to job
     * */
    add(queueName: "medium" | "content" | "high" | "low", data?: iJobData): any {
        const queue = this.queues.find(queue => queue.name === queueName);
        if (!queue) {
            console.error(`Queue ${queueName} not found, please make sure queue is configured`);
            return;
        }
        return queue?.bull.add(data, queue.options);
    },
    /**
     * @return void
     * */
    process() {
        this.queues.forEach(queue => {
            if (queue.onComplete) {
                queue.bull.on("completed", queue.onComplete);
            }
            if (queue.onError) {
                queue.bull.on("failed", queue.onError);
            }
            queue.bull.process(queue.handle);
        });
    }
};