import path from "path";
import Language from "../config/language";
import fs from "fs";

export default {
    translate: function (s: string, guild?: string, replace?: string): string {
        const split = s.split(".");
        const file = split[0];
        const keys = split.slice(1);
        const absoluteLangPath = path.join(__dirname, "..", "resources", "lang", Language.getInstance().lang(guild), file + ".json");
        //@ts-ignore
        const json = JSON.parse(fs.readFileSync(absoluteLangPath));

        return json[keys[0]] ? json[keys[0]].replace("_REPLACE_", replace) : `${keys.join(".")}`;
    }
};
