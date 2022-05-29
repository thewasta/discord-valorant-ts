import {_Match} from "./_Match";
import {_MatchPlayerDetails} from "./_MatchPlayerDetails";
import {_MatchTeams} from "./_MatchTeams";
import {_MatchRoundResults} from "./_MatchRoundResults";

export type MatchDetails = {
    matchInfo: _Match,
    players: _MatchPlayerDetails[]
    teams: _MatchTeams[]
    roundsResults: _MatchRoundResults[]
}