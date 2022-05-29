import {Command} from "./Command";

import {AddUser, Localization, Help, Settings, FindUser} from "./commands/slash";

export const Commands: Command[] = [Help, Localization, AddUser, Settings, FindUser];