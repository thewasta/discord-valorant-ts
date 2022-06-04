import {BaseWrapper} from "./BaseWrapper";
import app from "../../config/app";

export class Ranked extends BaseWrapper {

    private size: number = 200;

    async getLeaderboard(start: number): Promise<any> {
        return this.axios.get(`val/ranked/v1/leaderboards/by-act/${app.CURRENT_ACT}?size=${this.size}&startIndex=${start}`);
    }
}