import {config} from "dotenv";

const result = config();
if (result.error) {
    console.warn(`Failed to load .env file.`);
    process.exit(1);
}
const app = {
    DISCORD_TOKEN: process.env.TOKEN as string,
    APP_LOCAL: process.env.APP_LOCAL as string,
    REDIS_PORT: parseInt(process.env.REDIS_PORT as string),
    REDIS_SERVER: process.env.REDIS_SERVER as string,
    REDIS_USER: process.env.REDIS_USER as string,
    REDIS_DB: process.env.REDIS_DB as string,
    MONGODB_PASSWORD: process.env.MONGO_DB_PASSWORD as string,
    MONGODB_USER: process.env.MONGO_DB_USER as string,
    MONGO_COLLECTION: process.env.MONGO_COLLECTION as string,
    RIOT_VAL_TOKEN: process.env.RIOT_VAL_TOKEN as string,
    AUTHOR_ID: process.env.AUTHOR_DISCORD_ID as string,
    PUBLIC_VAL: process.env.PUBLIC_VAL_API as string,
    CURRENT_ACT: process.env.VALORANT_CURRENT_ACT as string,
    MS_IN_MINUTE: 60000,
    UPDATE_HISTORY_MINUTES: 24
};

export default app;