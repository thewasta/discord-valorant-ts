import {BaseWrapper} from "./BaseWrapper";
import {MatchDetails, MatchList} from "./types/match";

export class Match extends BaseWrapper {
    async getMatchListByPuuid(puuid: string): Promise<MatchList> {
        return this.axios.get(`/val/match/v1/matchlists/by-puuid/${puuid}`);
    }

    async getMatchById(matchId: string): Promise<MatchDetails> {
        return this.axios.get(`/val/match/v1/matches/${matchId}`);
    }
}