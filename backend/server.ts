import * as express from 'express';
import * as cors from 'cors';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as bcrypt from 'bcryptjs';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
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

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) return err;
        if(!user) res.send("No user exists");
        else{
            req.logIn(user, err => {
                if(err) return;
                res.send("Successfully authenticated");
                console.log(req.user);
            })
        }
    })(req, res, next);
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

app.get("/user", (req, res) => {
    res.json(req.user);
    console.log(req.user);
});

app.listen(4000, () => {
    console.log("Server has started");
});