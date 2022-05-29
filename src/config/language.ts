import {Server} from "../util/types/App/Server";
import localDatabase from "./localDatabase";

export default class Language {
    private static instance: Language;

    public static lang: string;

    private constructor() {
    }

    public static getInstance(): Language {
        if (!Language.instance) {
            Language.instance = new Language();
        }
        return Language.instance;
    }

    public lang(guild?: string): string {
        const rawServerData = localDatabase.get("server").value();
        const findGuild = rawServerData.find((raw: Server) => (
            raw.guild === guild
        ));

        return findGuild ? findGuild.lang : "eng";
    }
}