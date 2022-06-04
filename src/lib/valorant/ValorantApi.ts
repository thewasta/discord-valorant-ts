import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Regions} from "./types/regions";
import {Match} from "./Match";
import app from "../../config/app";
import {Ranked} from "./Ranked";

class ValorantApi {
    private readonly region: Regions;

    public Match: Match;

    public leaderboard: Ranked;

    constructor(token: string, region: Regions) {
        if (!token) {
            throw new Error("Token not provided");
        }
        if (!region) {
            throw new Error("Region not provided");
        }

        this.region = region;

        const axiosInstance: AxiosInstance = axios.create({
            baseURL: `https://${this.region}.api.riotgames.com`,
            headers: {
                "X-Riot-Token": token
            }
        });

        this.Match = new Match(axiosInstance);
        this.leaderboard = new Ranked(axiosInstance);
    }
}

export class Valorant {
    private static i: ValorantApi;

    private constructor() {
    }

    public static instance(): ValorantApi {
        if (!Valorant.i) {
            Valorant.i = new ValorantApi(app.RIOT_VAL_TOKEN, Regions.EUROPE);
        }
        return Valorant.i;
    }
}
