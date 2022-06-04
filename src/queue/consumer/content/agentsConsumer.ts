import {iPayload} from "../iPayload";
import {DoneCallback} from "bull";
import {PublicApiContent} from "../../../lib/public/PublicApi";
import path from "node:path";
import AgentSchema from "../../../database/models/agentSchema";
import fs from "node:fs";
import axios from "axios";

interface IAgent {
    uuid: string;
    displayName: string;
    displayIcon: string;
    displayIconSmall: string;
    bustPortrait: string;
    fullPortrait: string;
    fullPortraitV2: string;
    killfeedPortrait: string;
    role: {
        displayName: string
        displayIcon: string
    };
}

export default async function (payload: iPayload, done: DoneCallback) {
    const absolutResourcePath = path.join(__dirname, "..", "..", "resources", "images");
    const request = await PublicApiContent.instance().agents();
    const agentsData = request.data.data;
    const agentsAbsolutePath = path.join(absolutResourcePath, "agents");
    agentsData.map(async (agent: IAgent) => {
        const isExist = await AgentSchema.findOne({
            uuid: agent.uuid
        });
        const pathAgentName = agent.displayName.replace("\\", "").replace("/", "");
        if (!fs.existsSync(path.join(agentsAbsolutePath, pathAgentName))) {
            fs.mkdirSync(path.join(agentsAbsolutePath, pathAgentName));
        }
        if (agent.displayIcon) {
            const imageDisplayIcon = await axios.get(agent.displayIcon, {
                responseType: "stream"
            });
            if (imageDisplayIcon.data) {
                const displayIconPath = path.join(agentsAbsolutePath, pathAgentName, "icon.png");
                imageDisplayIcon.data.pipe(fs.createWriteStream(displayIconPath));
                agent.displayIcon = displayIconPath;
            }
        }
        if (agent.displayIconSmall) {
            const imageDisplayIconSmall = await axios.get(agent.displayIconSmall, {
                responseType: "stream"
            });
            if (imageDisplayIconSmall.data) {
                const displayIconSmallPath = path.join(agentsAbsolutePath, pathAgentName, "icon_small.png");
                imageDisplayIconSmall.data.pipe(fs.createWriteStream(displayIconSmallPath));
                agent.displayIconSmall = displayIconSmallPath;
            }
        }

        if (agent.bustPortrait) {
            const imagePortrait = await axios.get(agent.bustPortrait, {
                responseType: "stream"
            });
            if (imagePortrait.data) {
                const bustPath = path.join(agentsAbsolutePath, pathAgentName, "icon_bust.png");
                imagePortrait.data.pipe(fs.createWriteStream(bustPath));
                agent.bustPortrait = bustPath;
            }
        }
        if (agent.fullPortrait) {
            const fullPortrait = await axios.get(agent.fullPortrait, {
                responseType: "stream"
            });
            if (fullPortrait.data) {
                const fullPortraitPath = path.join(agentsAbsolutePath, pathAgentName, "icon_full.png");
                fullPortrait.data.pipe(fs.createWriteStream(fullPortraitPath));
                agent.fullPortrait = fullPortraitPath;
            }
        }
        if (agent.fullPortraitV2) {
            const fullPortraitV2 = await axios.get(agent.fullPortraitV2, {
                responseType: "stream"
            });
            if (fullPortraitV2.data) {
                const fullPortraitV2Path = path.join(agentsAbsolutePath, pathAgentName, "icon_full_v2.png");
                fullPortraitV2.data.pipe(fs.createWriteStream(fullPortraitV2Path));
                agent.fullPortraitV2 = fullPortraitV2Path;
            }
        }
        if (agent.killfeedPortrait) {
            const killFeedImage = await axios.get(agent.killfeedPortrait, {
                responseType: "stream"
            });
            if (killFeedImage.data) {
                const killFeedPath = path.join(agentsAbsolutePath, pathAgentName, "icon_kill_feed.png");
                killFeedImage.data.pipe(fs.createWriteStream(killFeedPath));
                agent.killfeedPortrait = killFeedPath;
            }
        }

        if (isExist) {
            await AgentSchema.findOneAndUpdate({
                uuid: agent.uuid
            }, agent);
        } else {
            await AgentSchema.create(agent);
        }
    });
    done(null, "Finished agents content");
}