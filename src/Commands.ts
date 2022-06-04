import {Command, Context} from "./Command";
import {AddUser, Localization, Help, Settings, FindUser} from "./commands/slash";
import {FindUserContext} from "./commands/userContext";

export const Commands: (Command | Context) [] = [Help, Localization, AddUser, Settings, FindUser, FindUserContext];
