import {BaseWrapper} from "./BaseWrapper";
import {MatchDetails} from "../../util/types/Api/MatchDetails";
import {AxiosResponse} from "axios";

export class Match extends BaseWrapper {
    //@todo
    // private readonly mockAbsPathMatchDetails: string = path.join(__dirname, "..", "..", "resources", "mock", "match.json");

    //@todo
    // private readonly mockAbsPathMatchList: string = path.join(__dirname, "..", "..", "resources", "mock", "matchlist.json");

    async getMatchListByPuuid(puuid: string): Promise<AxiosResponse> {
        return this.axios.get(`/val/match/v1/matchlists/by-puuid/${puuid}`);
    }

    async getMatchById(matchId: string): Promise<AxiosResponse> {
        return this.axios.get(`/val/match/v1/matches/${matchId}`);
    }
}