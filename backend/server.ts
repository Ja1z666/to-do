import express from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import bodyParser from 'body-parser';
import { prisma } from './connect';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser("secretcode"));

app.post("/login", (req, res) => {
    console.log(req.body);
});

app.post("/register", async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { username: req.body.username }
    });
    if(user) res.send("Чел уже существует!");
    if(!user){
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPassword
            }
        });
        res.send("Created!");
    }
});

app.get("/getUser", (req, res) => {});

app.listen(4000, () => {
    console.log("Server has started");
});