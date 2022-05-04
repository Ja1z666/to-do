import React, { useState } from "react";
import axios from 'axios';

export default function Main(){
    axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:4000/user"
    }).then(res => {
        if(res.data === "not auth"){
            window.location.href = "/auth";
        }
    });

    const logout = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/logout"
        }).then(res => window.location.href = "/auth");
    };

    return(
        <>
            <h1>Main</h1>
            <button onClick={logout}>Logout</button>
        </>
    )
}