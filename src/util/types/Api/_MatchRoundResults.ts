import {Teams} from "../Enums/Teams";
import {PlantSite} from "../Enums/PlantSite";
import {_MatchRoundPlayerStats} from "./_MatchRoundPlayerStats";

export type _MatchRoundResults = {
    roundNum: number
    roundResult: string
    winningTeam: Teams
    bombPlanter: string
    bombDefuser: string
    plantSite: PlantSite
    playerStats: _MatchRoundPlayerStats[]
}