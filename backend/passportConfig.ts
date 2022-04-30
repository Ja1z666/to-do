import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from './connect';

export function pass(passport){
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            const user = await prisma.user.findFirst({
                where: { username }
            });
            if(!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) return err;
                if(result === true){
                    return done(null, user);
                }else{
                    return done(null, false);
                }
            })
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser(async (id, cb) => {
        const user = await prisma.user.findFirst({
            where: { id }
        });

        cb(user);
    });
}