import 'dotenv/config';
import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.js";
import loadRoutes from "./routes/load.js";
// mongoDB Connection


mongoose.connect(`${process.env.DB_CONNECTION}`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Connected to ProjectTracking2 database');
}).on('error', (error) => {
    console.log('connection error ', error);
});

const app = express();
const PORT = process.env.PORT || 5300;

// app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// handling cors
app.use(cors("*"));
// app.use(cors({
//     // origin: 'http://localhost:3000'
//     origin: "https://uipprojecttracking.up.railway.app"
// }));



// routes

app.get('/', (req, res, next) => {
    res.send(`server running at port ${PORT}`)
})

app.use('/user', userRoutes);
app.use('/load', loadRoutes)



// error Handling

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})