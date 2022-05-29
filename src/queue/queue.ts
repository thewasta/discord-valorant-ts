import Queue from "bull";
import {jobs} from "./queues";

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key/* {
        limiter: {
            max: 3,
            duration: 600000,
            groupKey: "guild"
        }
    }*/),
    name: job.key,
    handle: job.handle,
    options: job.options,
    onComplete: job.onComplete,
    onError: job.onError
}));

interface iJobData {
    command: string,
    channel?: string;
    guild?: string;
    dsUser?: string
    dsUserId?: string
    payload?: any;
}

export const queue = {
    queues,
    /**
     * @param queueName The name of queue
     * @param data Data to pass to job
     * */
    add(queueName: string, data?: iJobData): any {
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