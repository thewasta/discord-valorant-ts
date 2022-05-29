import {connect} from "mongoose";
import app from "./app";

export class MongoDataBase {
    async init() {

        await connect(`mongodb+srv://${app.MONGODB_USER}:${app.MONGODB_PASSWORD}@cluster0.qemcm.mongodb.net/${app.MONGO_COLLECTION}`, {
            //@ts-ignore
            useNewUrlParser: true, useUnifiedTopology: true
        });
    }
}

