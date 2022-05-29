import {Command} from "../../Command";
import {BaseCommandInteraction, Client} from "discord.js";
import utils from "../../util/utils";

const Settings: Command = {
    name: "settings",
    description: utils.translate("commands.settings"),
    run: async (client: Client, interaction: BaseCommandInteraction) => {

    }
};

export default Settings;