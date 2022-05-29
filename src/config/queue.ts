import Queue from "bull";
import app from "./app";

function createQueue(queueConfig: QueueConfiguration): Queue.Queue {
    return new Queue(queueConfig.name, queueConfig.settings);
}

interface QueueConfiguration {
    name: string;
    settings?: Queue.QueueOptions;
}

/**
 * Each object is a queue
 */
const queuesConfiguration: QueueConfiguration[] = [
    {
        name: "sample-queue",
        settings: {
            redis: {
                port: app.REDIS_PORT,
                host: app.REDIS_SERVER
            }
        }
    }
];

let queues: Queue.Queue[] = [];

queuesConfiguration.map(queue => {
    queues.push(createQueue(queue));
});

function queue(queueName: string): Queue.Queue {
    const queue = queues.find(queue => (
        queue.name === queueName
    ));
    if (!queue) {
        throw new Error(`Queue name: ${queueName} not found.`);
    }
    return queue;
}