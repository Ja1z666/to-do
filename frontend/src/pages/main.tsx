import React, { useEffect, useState } from "react";
import axios from 'axios';
import { TodoItem } from "./components/todoItem";
import { CreateTodoField } from "./components/createTodoField";
import { CreateFolderField } from "./components/createFolderField";

export default function Main(){
    const [todos, setTodos] = useState([]);
    const [folders, setFolders] = useState([]);
    const [folder, setFolder] = useState("");
    const [folderName, setFolderName] = useState("");
    const [username, setUsername] = useState(null);

    // const changeTodo = (id: string) => {
	// 	const copy = [...todos]
	// 	const current = copy.find(t => t.id === id)!
	// 	current.isCompleted = !current.isCompleted
	// 	setTodos(copy)
	// }

    // const removeTodo = (id: string) => setTodos([...todos].filter(t => t.id !== id))

    useEffect(() => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/user"
        }).then(res => {
            if(res.data === "not auth"){
                window.location.href = "/auth";
            }else{
                setUsername(res.data.username);
            }
        });
        getFolder();
    }, [])

    const getTask = (id:string) => {
        axios({
            method: "POST",
            data: {
                id
            },
            withCredentials: true,
            url: "http://localhost:4000/getUserTask"
        }).then(res => setTodos(res.data));
    }

    const getFolder = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/getUserFolder"
        }).then(res => {
            setFolders(res.data);
            if(res.data.length){
                getTask(res.data[0].id);
                setFolder(res.data[0].id);
                setFolderName(res.data[0].title);
            }
        });
    }

    const logout = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/logout"
        }).then(res => window.location.href = "/auth");
    };

    return(
        <>
            <header>
                <div className="container header-container">
                    <div className="header-block">
                        <h1>Welcome back, {username}!</h1>
                        <button onClick={logout} className="btn-reset">Logout</button>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="block">
                        <div className="block-content">
                            <div className="folders">
                                <CreateFolderField getFolder={getFolder}/>
                                <div className="folders-list">
                                    {folders.map(folder => (
                                        <button className="btn-reset" key={folder["id"]} onClick={() => {getTask(folder["id"]); setFolder(folder["id"]); setFolderName(folder["title"])}}>{folder["title"]}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="todo-app">
                                <div className="todo-content">
                                    <h2>{folderName}</h2>
                                    {
                                        folders.length ? <CreateTodoField getTask={getTask} folder={folder}/> : <p>У вас нету папок</p>
                                    }
                                    <div className="tasks">
                                        {todos.map(todo => (
                                            <TodoItem key={todo["id"]} todo={todo} getTask={getTask} folder={folder} />
                                        ))}
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