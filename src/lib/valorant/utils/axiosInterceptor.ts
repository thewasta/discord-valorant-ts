import {AxiosInstance, AxiosResponse, AxiosError} from "axios";

interface ApiError {
    request: {
        method: string;
        path: string;
        baseUrl: string;
        headers: { [header: string]: string };
    };
    status: number;
    error: string;
}

export const axiosInterceptor = (axios: AxiosInstance): AxiosInstance => {
    axios.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError): Promise<ApiError> => {
            const {config} = error;
            return Promise.reject({
                request: {
                    method: config.method,
                    path: error.config.url,
                    baseURL: error.config.baseURL,
                    headers: error.config.headers
                },
                status: error.response?.status,
                error:
                //@ts-ignore
                    error.response?.data?.status.message ||
                    error.response?.data ||
                    error.message
            });
        }
    );

    return axios;
};