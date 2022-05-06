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
            <header>
                <div className="container header-container">
                    <div className="header-block">
                        <h1>Todo List xDD ~honk-honk~ ...hahaha</h1>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="block">
                        <div className="auth-block">
                            <div className="log-block">
                                <div className="login">
                                    <div className="content">
                                        <h1>Login</h1>
                                        <input type="text" placeholder="username" onChange={e => setLoginUsername(e.target.value)} />
                                        <input type="password" placeholder="password" onChange={e => setLoginPassword(e.target.value)} />
                                        <button onClick={login}>Login</button>
                                    </div>
                                </div>
                            </div>
                            <div className="reg-block">
                                <div className="register">
                                    <div className="content">
                                        <h1>Register</h1>
                                        <input type="text" placeholder="username" onChange={e => setRegisterUsername(e.target.value)} />
                                        <input type="password" placeholder="password" onChange={e => setRegisterPassword(e.target.value)} />
                                        <button onClick={register}>Register</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}