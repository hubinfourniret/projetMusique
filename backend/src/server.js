import express from 'express'
import cors from 'cors'
import { initWebSocket } from './websocket.js'
import trackRouter from './routes/track.js'
import searchRouter from './routes/search.js'
import votesRouter from './routes/votes.js'
import authRouter from './routes/auth.js'
import playerRouter from './routes/player.js'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/search', searchRouter)
app.use('/api/votes', votesRouter);
app.use('/api/track', trackRouter);
app.use('/api/player', playerRouter);
app.use('/api/auth', authRouter);


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

initWebSocket(server)
