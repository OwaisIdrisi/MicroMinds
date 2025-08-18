import { configDotenv } from "dotenv";
import express from "express"
import cors from "cors"
import routes from "./routes/index.js"
import cookieParser from "cookie-parser"

configDotenv({
    path: "./.env"
})

export const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api", routes)