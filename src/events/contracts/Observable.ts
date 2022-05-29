import {Observer} from "./Observer";

export interface Observable {
    publish(event: Observer): void;

    suppress(event: Observer): void;

    notify(): void;
}