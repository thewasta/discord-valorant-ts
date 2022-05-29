import {Observable} from "./contracts/Observable";
import {Observer} from "./contracts/Observer";

class DispatcherObservable implements Observable {

    private events: Observer[] = [];

    private static instance: DispatcherObservable;

    private constructor() {
    }

    public static getInstance(): DispatcherObservable {
        if (!DispatcherObservable.instance) {
            DispatcherObservable.instance = new DispatcherObservable();
        }
        return DispatcherObservable.instance;
    }

    publish(event: Observer): void {
        const isExist = this.events.includes(event);
        if (isExist) return console.log(`Event already published, ${event}`);
        this.events.push(event);
    }

    suppress(event: Observer): void {
        const eventIndex = this.events.indexOf(event);
        if (eventIndex === -1) return console.log(`Event not found, ${event}`);
        this.events.splice(eventIndex, 1);
    }

    notify(): void {
        for (const event of this.events) {
            event.listen();
        }
    }
}

export const Dispatcher = DispatcherObservable.getInstance();

