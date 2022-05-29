import StormDB from "stormdb";
import {join} from "path";
import {Server} from "../util/types/App/Server";

type Data = {
    server?: Server[]
}

class DatabaseEngine {
    private static pathToDB: string = join(__dirname, "..", "resources", "data", "db.json");

    private static stormDB: StormDB;

    private constructor() {
    }

    public static getInstance(): StormDB {
        if (!DatabaseEngine.stormDB) {
            const engine = new StormDB.localFileEngine(DatabaseEngine.pathToDB);
            const dbDefault: Data = {server: []};
            DatabaseEngine.stormDB = new StormDB(engine);
            DatabaseEngine.stormDB.default(dbDefault);
        }
        return DatabaseEngine.stormDB;
    }
}

const Database = DatabaseEngine.getInstance();
export default Database;