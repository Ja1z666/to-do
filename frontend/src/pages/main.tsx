import React, { useEffect, useState } from "react";
import axios from 'axios';
import { TodoItem } from "./components/todoItem";
import { CreateTodoField } from "./components/createTodoField";
import { FolderItem } from "./components/folderItem";
import { CreateFolderField } from "./components/createFolderField";

interface SharedFolder {
    folder: {
        id: string;
        title: string;
        authorId: number;
    };
    folderId: number;
    id: number;
    userId: number;
}

export default function Main(){
    const [todos, setTodos] = useState([]);
    const [folders, setFolders] = useState([]);
    const [sharedFolder, setSharedFolder] = useState([]);
    const [folder, setFolder] = useState("");
    const [folderName, setFolderName] = useState("");
    const [username, setUsername] = useState(null);

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
        getSharedFolder();
    }, [])

    const getTask = (id:string) => {
        axios({
            method: "POST",
            data: {
                id
            },
            withCredentials: true,
            url: "http://localhost:4000/getUserTask"
        }).then(res => {
            let sortedDescending = res.data.sort((a:any, b:any) => {
                return b.id - a.id;
            });

            sortedDescending.sort((a:any, b:any) => {
                return Number(a.isCompleted) - Number(b.isCompleted);
            });
            setTodos(sortedDescending);
        });
    }

    const getFolder = async () => {
        await axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/getUserFolder"
        }).then(res => {
            setFolders(res.data);
            if(res.data.length){
                getTask(res.data[0].id);
                setFolder(res.data[0].id);
                setFolderName(res.data[0].title);
            }else{
                getTask("");
                setFolder("");
                setFolderName("");
            }
        });
    }

    const getSharedFolder = async () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:4000/getSharedFolders"
        }).then(res => setSharedFolder(res.data));
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
                                        <FolderItem key={folder["id"]} folder={folder} setFolder={setFolder} setFolderName={setFolderName} getTask={getTask} getFolder={getFolder}/>
                                    ))}
                                    <h3>Shared</h3>
                                    {sharedFolder.map((folder:SharedFolder) => (
                                        <div className="folder">
                                            <div className="folder-title">
                                                <button className="btn-reset" key={folder.folder.id} onClick={() => {getTask(folder.folder.id); setFolder(folder.folder.id); setFolderName(folder.folder.title)}}>{folder.folder.title}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="todo-app">
                                <div className="todo-content">
                                    <h2>{folderName}</h2>
                                    {
                                        folders.length ? <CreateTodoField getTask={getTask} folder={folder}/> : <p className="no-folders">You don't have folders...</p>
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