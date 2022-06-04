import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {Account} from "../../../lib/account/AccountApi";
import ValorantUserDetails from "../../../database/models/valorantUserDetails";
import RankingSchema from "../../../database/models/rankingSchema";
import {Valorant} from "../../../lib/valorant/ValorantApi";

/**
 * Al añadir a un usuario buscamos en la base de datos 'local' si ya tenemos información de este usuario
 * como puuid, para evitar hacer petición a la API de Riot.
 * Si no tenemos el usuario buscando por GAMENAME#TAG en nuestra base de datos, buscamos al usuario en la
 * API de Riot, con la respuesta volver hacer una búsqueda en nuestra base de datos, buscando por PUUID
 * Si encontramos por PUUID actualizamos los datos de nuestra base datos.
 * Luego añadimos el usuario al ranking del server, en caso de no existir ranking previamente, se crea.
 * @param payload
 * @param done
 */
export default async function (payload: iPayload, done: DoneCallback) {
    if (!payload.payload.targetDiscordID || !payload.payload.targetDiscordTag) {
        done(new Error(`Discord user not found: ${payload.payload.targetDiscordTag}`), {
            ...payload,
            message: "errors.add_user_not_found"
        });
        return;
    }
    const {gameName, tagLine} = payload.payload;
    const filter = {
        gameName: gameName,
        tagLine: tagLine
    };

    /***
     * Find user tag in mongo database
     */
    const findUserByGameNick = await ValorantUserDetails.findOne(filter);

    if (!findUserByGameNick) {
        try {
            /**
             * Find user with Riot API
             * */
            const findByGameTag = await Account.instance().profile(gameName, tagLine);
            const requestData = findByGameTag.data;
            try {

                const findUserByPuuid = await ValorantUserDetails.find({
                    puuid: requestData.puuid
                });
                const findUserByPuuidInGuild = await ValorantUserDetails.findOne({
                    guild: payload.guild,
                    puuid: requestData.puuid
                });
                if (findUserByPuuid.length) {
                    findUserByPuuid.map(async (user) => {
                        await ValorantUserDetails.findByIdAndUpdate(user._id, {
                            gameName: user.gameName,
                            tagLine: user.tagLine
                        });
                    });
                }

                if (!findUserByPuuidInGuild) {
                    await (await ValorantUserDetails.create({
                        puuid: requestData.puuid,
                        tagLine,
                        gameName,
                        ds_user: payload.payload.targetDiscordTag,
                        ds_user_id: payload.payload.targetDiscordID,
                        guild: payload.guild
                    })).save();
                }
                const ranking = await RankingSchema.findOne({
                    guild: payload.guild
                });
                if (ranking) {

                    await RankingSchema.findOneAndUpdate({
                        guild: payload.guild
                    }, {
                        $push: {
                            users: {
                                puuid: requestData.puuid,
                                discord_id: payload.payload.targetDiscordTag
                            }
                        }
                    });
                } else {
                    await RankingSchema.create({
                        guild: payload.guild,
                        users: [
                            {
                                puuid: requestData.puuid,
                                discord_id: payload.payload.targetDiscordTag
                            }
                        ]
                    });
                }

            } catch (e) {
                done(new Error("Couldn't make request to MongoDB, Valorant User Details"), payload);
            }
        } catch (e) {
            done(new Error("Couldn't make request to Riot API"), payload);
        }

        done(null, {
            ...payload,
            message: "messages.add_user_successfully"
        });
    } else {
        const ranking = await RankingSchema.findOne({
            guild: payload.guild
        });
        const findUserByPuuidInGuild = await ValorantUserDetails.findOne({
            guild: payload.guild,
            puuid: findUserByGameNick.puuid
        });
        if (!findUserByPuuidInGuild) {
            await ValorantUserDetails.create({
                puuid: findUserByGameNick.puuid,
                tagLine,
                gameName,
                ds_user: payload.payload.targetDiscordTag,
                ds_user_id: payload.payload.targetDiscordID,
                guild: payload.guild
            });
        }
        if (ranking) {
            const userRanking = await RankingSchema.find({
                "users.puuid": findUserByGameNick.puuid
            });

            if (!userRanking) {
                await RankingSchema.findOneAndUpdate({
                    guild: payload.guild
                }, {
                    $push: {
                        users: {
                            puuid: findUserByGameNick.puuid,
                            discord_id: payload.payload.targetDiscordTag
                        }
                    }
                });
                done(null, {
                    ...payload,
                    message: "messages.add_user_successfully"
                });
            } else {
                done(null, {
                    ...payload,
                    message: "errors.add_user_already"
                });
            }
        } else {
            await (await RankingSchema.create({
                guild: payload.guild,
                users: [
                    {
                        puuid: findUserByGameNick.puuid,
                        discord_id: payload.payload.targetDiscordTag
                    }
                ]
            })).save();
            done(null, {
                ...payload,
                message: "messages.add_user_successfully"
            });
        }
    }
}