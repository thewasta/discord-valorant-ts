import {Regions} from "./types/regions";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import app from "../../config/app";

class AccountApi {

    private readonly axios: AxiosInstance;

    constructor(token: string, region: Regions) {

        this.axios = axios.create({
            baseURL: `https://${region}.api.riotgames.com`,
            headers: {
                "X-Riot-Token": token
            }
        });
    }

    public async profile(nickName: string, gameTag: string): Promise<any | AxiosResponse> {
        return this.axios.get(encodeURI(`/riot/account/v1/accounts/by-riot-id/${nickName}/${gameTag}`));
    }
}

export class Account {
    private static i: AccountApi;

    private constructor() {
    }

    public static instance(): AccountApi {
        if (!Account.i) {
            Account.i = new AccountApi(app.RIOT_VAL_TOKEN, Regions.EU);
        }
        return Account.i;
    }

}
