import {AxiosInstance} from "axios";

export abstract class BaseWrapper {
    protected axios: AxiosInstance;

    constructor(axios: AxiosInstance) {
        this.axios = axios;
    }
}