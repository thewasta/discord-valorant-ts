import {Maps} from "../Enums/Maps";

export type _Match = {
    matchId: string
    mapId: Maps
    gameLengthMillis: number
    gameStartMillis: number
    queueId: string
    gameMode: string
    isRanked: boolean
    seasonId: string
}