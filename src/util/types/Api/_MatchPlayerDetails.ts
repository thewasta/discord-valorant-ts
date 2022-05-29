import {Teams} from "../Enums/Teams";
import {_PlayerMatchStats} from "./_PlayerMatchStats";
import {Character} from "../Enums/Character";

export type _MatchPlayerDetails = {
    puuid: string,
    teamId: Teams
    characterId: Character
    stats: _PlayerMatchStats
}