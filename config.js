import dotenv from "dotenv";

dotenv.config(".env");

const {PORT , DB_USERNAME, DB_HOST,DB_PORT,DB_NAME,DB_PASSWORD , HASH , JWT , CLIENT_ID , CLIENT_HOST,CLIENT_SECRET,FRONT_END_URL} = process.env
export const config = {
    PORT,
    DB_USERNAME,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    HASH,
    JWT,
    CLIENT_ID,
    CLIENT_HOST,CLIENT_SECRET,FRONT_END_URL
}
