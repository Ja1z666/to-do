import React, { useState } from "react";
import axios from 'axios';

export default function Auth(){
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const register = () => {
        axios({
            method: "POST",
            data: {
                username: registerUsername,
                password: registerPassword
            },
            withCredentials: true,
            url: "http://localhost:4000/register"
        }).then(res => console.log(res));
    };
    const login = () => {
        axios({
            method: "POST",
            data: {
                username: loginUsername,
                password: loginPassword
            },
            withCredentials: true,
            url: "http://localhost:4000/login"
        }).then(res => {
            if(res.data === "Successfully authenticated"){
                window.location.href = "/";
            }
        });
    };

    return(
        <>
            <div className="register">
                <h1>Register</h1>
                <input type="text" placeholder="username" onChange={e => setRegisterUsername(e.target.value)} />
                <input type="password" placeholder="password" onChange={e => setRegisterPassword(e.target.value)} />
                <button onClick={register}>Submit</button>
            </div>
            <div className="login">
                <h1>Login</h1>
                <input type="text" placeholder="username" onChange={e => setLoginUsername(e.target.value)} />
                <input type="password" placeholder="password" onChange={e => setLoginPassword(e.target.value)} />
                <button onClick={login}>Submit</button>
            </div>
        </>
    )
}