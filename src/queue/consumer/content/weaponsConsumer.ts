import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {PublicApiContent} from "../../../lib/public/PublicApi";
import path from "node:path";
import WeaponsSchema from "../../../database/models/weaponsSchema";
import axios from "axios";
import fs from "node:fs";

export default async function (payload: iPayload, done: DoneCallback) {
    const absolutResourcePath = path.join(__dirname, "..", "..", "resources", "images");

    const request = await PublicApiContent.instance().weapons();
    const weaponsData = request.data.data;
    const weaponImagesPath = path.join(absolutResourcePath, "weapons");
    weaponsData.map(async (weapon: {
        uuid: string;
        displayName: string;
        displayIcon: string;
    }) => {
        const weaponImagePath = path.join(weaponImagesPath, weapon.displayName + ".png");

        const isExist = await WeaponsSchema.findOne({
            uuid: weapon.uuid
        });

        if (weapon.displayIcon) {
            const image = await axios.get(weapon.displayIcon, {
                responseType: "stream"
            });
            if (image.data) {
                image.data.pipe(fs.createWriteStream(weaponImagePath));
                weapon.displayIcon = weaponImagePath;
            }
        }

        if (isExist) {
            await WeaponsSchema.findOneAndUpdate({
                uuid: weapon.uuid
            }, weapon);

        } else {
            await WeaponsSchema.create(weapon);
        }
    });
    done(null, "Finished weapon content");

}