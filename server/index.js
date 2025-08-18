import { app } from "./app.js";
import { connectToDB } from "./db/index.js";
import fs from "fs";
import path from "path";

// folder path
const tempDir = path.join(process.cwd(), "public/temp");

// check & create folder if not exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log("✅ public/temp folder created");
}


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