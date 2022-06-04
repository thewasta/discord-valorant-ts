import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {Valorant} from "../../../lib/valorant/ValorantApi";

export default async function (payload: iPayload, done: DoneCallback) {

    let index = 0;

    done(null, payload);
}