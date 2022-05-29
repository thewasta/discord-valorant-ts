import axios, {AxiosInstance} from "axios";
import {Regions} from "./types/regions";
import {Match} from "./Match";
import app from "../../config/app";

class ValorantApi {
    private readonly region: Regions;

    public Match: Match;

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
