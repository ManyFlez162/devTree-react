import express from 'express'
import cors from "cors"
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

const app = express()

connectDB()

app.use(cors(corsConfig))

// Leer datos de formularios
app.use(express.json())

app.use('/', router)

export default app