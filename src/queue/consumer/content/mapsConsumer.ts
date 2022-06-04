import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {PublicApiContent} from "../../../lib/public/PublicApi";
import path from "node:path";
import MapsSchema from "../../../database/models/mapsSchema";
import axios from "axios";
import fs from "node:fs";

interface iMap {
    uuid: string;
    displayName: string;
    coordinates: string;
    displayIcon: string;
    listViewIcon: string;
    splash: string;
    assetPath: string;
    mapUrl: string;
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
}

export default async function (payload: iPayload, done: DoneCallback) {
    const absolutResourcePath = path.join(__dirname, "..", "..", "resources", "images");
    const request = await PublicApiContent.instance().maps();
    const mapsData = request.data.data;
    const mapImagesPath = path.join(absolutResourcePath, "maps");

    mapsData.map(async (map: iMap) => {
        const isExist = await MapsSchema.findOne({
            uuid: map.uuid
        });
        const mapDisplayImagePath = path.join(mapImagesPath, map.displayName + "_display.png");
        const mapListViewImagePath = path.join(mapImagesPath, map.displayName + "_listview.png");
        const mapSplashImagePath = path.join(mapImagesPath, map.displayName + "_splash.png");
        if (map.displayIcon) {
            const displayIcon = await axios.get(map.displayIcon, {
                responseType: "stream"
            });
            if (displayIcon.data) {
                displayIcon.data.pipe(fs.createWriteStream(mapDisplayImagePath));
                map.displayIcon = mapDisplayImagePath;
            }
        }

        if (map.listViewIcon) {
            const listViewIcon = await axios.get(map.listViewIcon, {
                responseType: "stream"
            });
            if (listViewIcon.data) {
                listViewIcon.data.pipe(fs.createWriteStream(mapListViewImagePath));
                map.listViewIcon = mapListViewImagePath;
            }
        }

        if (map.splash) {
            const splashIcon = await axios.get(map.splash, {
                responseType: "stream"
            });

            if (splashIcon.data) {
                splashIcon.data.pipe(fs.createWriteStream(mapSplashImagePath));
                map.splash = mapSplashImagePath;
            }
        }

        if (isExist) {
            await MapsSchema.findOneAndUpdate({
                uuid: map.uuid
            }, map);
        } else {
            await MapsSchema.create(map);
        }
    });
    done(null, "Finished map content");

}