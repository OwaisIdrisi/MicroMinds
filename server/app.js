import express from "express"
import cors from "cors"
import routes from "./routes/index.js"
import cookieParser from "cookie-parser"


export const app = express()
console.log(process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api", routes)