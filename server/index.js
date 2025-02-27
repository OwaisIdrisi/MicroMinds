import { configDotenv } from "dotenv";
import { app } from "./app.js";
import { connectToDB } from "./db/index.js";


configDotenv({
    path: "./.env"
})

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port ${process.env.PORT}`);
        })
    })
    .catch(error => {
        console.log("MongoDb connection failed", error
        );
    })