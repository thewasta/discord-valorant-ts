import axios, {AxiosInstance, AxiosResponse} from "axios";
import app from "../../config/app";

enum Languages {
    es = "es-ES",
    en = "en-US"
}

class PublicApi {
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: app.PUBLIC_VAL
        });
    }

    public async competitive(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/competitivetiers?language=${lang}`);
    }

    public async weapons(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/weapons?language=${lang}`);
    }

    public async maps(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/maps?language=${lang}`);
    }

    public async agents(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/agents?language=${lang}`);
    }

    public async seasons(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/seasons?language=${lang}`);
    }

    public async gamemodes(lang: Languages = Languages.en): Promise<any | AxiosResponse> {
        return this.axios.get(`v1/gamemodes?languages=${lang}`);
    }
}

export class PublicApiContent {
    private static i: PublicApi;

    private constructor() {
    }

    public static instance(): PublicApi {
        if (!PublicApiContent.i) {
            PublicApiContent.i = new PublicApi();
        }
        return PublicApiContent.i;
    }
}