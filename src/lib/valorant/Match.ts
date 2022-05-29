import {BaseWrapper} from "./BaseWrapper";
import {MatchDetails, MatchList} from "./types/match";
import fs from "fs";
import path from "path";

/**
 * MOCK
 *  */
export class Match extends BaseWrapper {
    //@todo
    private readonly mockAbsPathMatchDetails: string = path.join(__dirname, "..", "..", "resources", "mock", "match.json");

    //@todo
    private readonly mockAbsPathMatchList: string = path.join(__dirname, "..", "..", "resources", "mock", "matchlist.json");

    async getMatchListByPuuid(puuid: string): Promise<any> {
        // @todo MOCK
        //@ts-ignore
        return JSON.parse(fs.readFileSync(this.mockAbsPathMatchList));

        /* @todo REMOVE WHEN API AVAILABLE
        return this.axios.get(`/val/match/v1/matchlists/by-puuid/${puuid}`);
         */
    }

    async getMatchById(matchId: string): Promise<MatchDetails> {
        // @todo MOCK
        //@ts-ignore
        return JSON.parse(fs.readFileSync(this.mockAbsPathMatchDetails));
        /**
         return this.axios.get(`/val/match/v1/matches/${matchId}`);
         */
    }
}