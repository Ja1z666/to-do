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
    if(req.isAuthenticated()) {
        res.send(req.user);
    }else {
        res.send("not auth");
    }
});

app.post("/createFolder", async (req, res) => {
    if(req.isAuthenticated()){
        await prisma.user.update({
            where: {
                id: req.user["id"]
            },
            data: {
                folders: {
                    create: {
                        title: req.body.title
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/deleteFolder", async (req, res) => {
    if(req.isAuthenticated()){
        await prisma.share.deleteMany({
            where: {
                folderId: req.body.id
            }
        });
        
        await prisma.user.update({
            where: {
                id: req.user["id"]
            },
            data: {
                folders: {
                    delete: {
                        id: req.body.id
                    }
                }
            }
        });
        await prisma.task.deleteMany({
            where: {
                folderId: req.body.id,
                AND: {
                    authorId: req.user["id"]
                }
            }
        })
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.get("/getUserFolder", async (req, res) => {
    if(req.isAuthenticated()){
        const folder = await prisma.folder.findMany({
            where: {
                authorId: req.user["id"]
            }
        });
        res.send(folder);
    }else{
        res.send("Not auth");
    }
});

app.post("/createTask", async (req, res) => {
    if(req.isAuthenticated()){
        let user:any = await prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        });
        if(!user) user = req.user["id"];
        else user = user.folder.authorId;

        await prisma.user.update({
            where: {
                id: user
            },
            data: {
                tasks: {
                    create: {
                        title: req.body.title,
                        isCompleted: false,
                        date: req.body.date,
                        folderId: req.body.id
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/deleteTask", async (req, res) => {
    if(req.isAuthenticated()){
        let user:any = await prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        })
        if(!user) user = req.user["id"];
        else user = user.folder.authorId;

        await prisma.user.update({
            where: {
                id: user
            },
            data: {
                tasks: {
                    delete: {
                        id: req.body.id
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/updateTask", async (req, res) => {
    if(req.isAuthenticated()){
        let user:any = await prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        })
        if(!user) user = req.user["id"];
        else user = user.folder.authorId;

        let task = await prisma.task.findFirst({
            where: {
                id: req.body.id
            }
        });

        await prisma.user.update({
            where: {
                id: user
            },
            data: {
                tasks: {
                    update: {
                        where: {
                            id: req.body.id
                        },
                        data:{
                            isCompleted: !task.isCompleted
                        }
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/changeTitleTask", async (req, res) => {
    if(req.isAuthenticated()){
        let user:any = await prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        })
        if(!user) user = req.user["id"];
        else user = user.folder.authorId;

        await prisma.user.update({
            where: {
                id: user
            },
            data: {
                tasks: {
                    update: {
                        where: {
                            id: req.body.id
                        },
                        data: {
                            title: req.body.title
                        }
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/changeDateTask", async (req, res) => {
    if(req.isAuthenticated()){
        let user:any = await prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        })
        if(!user) user = req.user["id"];
        else user = user.folder.authorId;

        await prisma.user.update({
            where: {
                id: user
            },
            data: {
                tasks: {
                    update: {
                        where: {
                            id: req.body.id
                        },
                        data: {
                            date: req.body.date
                        }
                    }
                }
            }
        });
        res.send("Greate");
    }else{
        res.send("Not auth");
    }
});

app.post("/getUserTask", async (req, res) => {
    if(req.isAuthenticated()){
        if(!req.body.id) return res.send([]);

        let user:any;
        await prisma.user.findFirst({
            where: {
                id: req.user["id"]
            }
        }).then(e => user = e.id);
        if(!user) prisma.share.findFirst({
            where: {
                userId: req.user["id"]
            }
        }).then(e => user = e.userId);
        if(!user) return;

        const task = await prisma.task.findMany({
            where: {
                folderId: req.body.id
            }
        });
        res.send(task);
    }else{
        res.send("Not auth");
    }
});

app.post("/createToken", async (req, res) => {
    if(req.isAuthenticated()){
        const folder = await prisma.task.findMany({
            where: {
                folderId: req.body.folderId,
                AND: {
                    authorId: req.user["id"]
                }
            }
        });
        if(!folder) return;
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username
            }
        })
        if(!user) return res.send("Unknown user");
        prisma.token.create({
            data: {
                folderId: req.body.folderId,
                targerUserId: user.id
            }
        }).then(e => res.send("http://localhost:4000/invite/verification/" + e.id));
    }else{
        res.send("Not auth");
    }
});

app.get("/invite/verification/:token", async (req, res) => {
    if(req.isAuthenticated()){
        const token = await prisma.token.findFirst({
            where: {
                id: req.params.token
            }
        });
        if(!token) return res.send(`<h1>Bad token</h1>`);
        if(token.targerUserId != req.user["id"]) return res.send(`<h1>Nice try</h1>`);
        await prisma.folder.update({
            where: {
                id: token.folderId
            },
            data: {
                sharedTo: {
                    create: {
                        userId: token.targerUserId
                    }
                }
            }
        });
        await prisma.token.delete({
            where: {
                id: token.id
            }
        });
        res.send(`<h1><a href="http://localhost:3000/">Move to to-do</a></h1>`);
    }else{
        res.send(`<h1>Please login <a href="http://localhost:3000/">here</a></h1>`);
    }
});

app.get("/getSharedFolders", async (req, res) => {
    if(req.isAuthenticated()){
        const folder = await prisma.share.findMany({
            where: {
                userId: req.user["id"]
            },
            include: {
                folder: {}
            }
        });
        res.send(folder);
    }else{
        res.send("Not auth");
    }
});

app.get("/logout", (req, res) => {
    req.logout();
    res.send("success")
});

app.listen(4000, () => {
    console.log("Server has started");
});