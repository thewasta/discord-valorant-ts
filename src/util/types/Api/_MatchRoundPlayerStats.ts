import {_MatchRoundPlayerKills} from "./_MatchRoundPlayerKills";
import {_MatchRoundPlayerDamage} from "./_MatchRoundPlayerDamage";
import {_MatchRoundEconomy} from "./_MatchRoundEconomy";

export type _MatchRoundPlayerStats = {
    puuid: string
    kills: _MatchRoundPlayerKills[]
    damage: _MatchRoundPlayerDamage[]
    score: number
    economy: _MatchRoundEconomy
}