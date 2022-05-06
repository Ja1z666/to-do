import axios from "axios";
import { useState } from "react";

interface TodoProps {
    todo: {
        id: string
        title: string;
        isCompleted: boolean;
    },
    getTask: any;
    folder: any;
}

export function TodoItem({todo, getTask, folder}:TodoProps){
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('')

    const deleteTask = async (todo:any) => {
        await axios({
            method: "POST",
            data: {
                id: todo.id
            },
            withCredentials: true,
            url: "http://localhost:4000/deleteTask"
        });
        getTask(folder);
    };
    
    const updateTask = async (todo:any) => {
        await axios({
            method: "POST",
            data: {
                id: todo.id
            },
            withCredentials: true,
            url: "http://localhost:4000/updateTask"
        });
        getTask(folder);
    };

    const changeTitle = async (title:string, id:string) => {
		await axios({
            method: "POST",
            data: {
                id,
                title
            },
            withCredentials: true,
            url: "http://localhost:4000/changeTitleTask"
        });
        setEditMode(!editMode);
		setTitle('');
        getTask(folder);
	}

    const changeEditMode = () => {
        setEditMode(!editMode);
    }

    return(
        <div className="task">
            {
                editMode ? 
                <input placeholder={todo.title} onChange={e => setTitle(e.target.value)} value={title} onKeyPress={e => e.key === 'Enter' && changeTitle(title, todo.id)}></input> :
                <div className="title">
                    <button onClick={() => updateTask(todo)} className={todo.isCompleted ? "btn-reset complete-true" : "btn-reset complete-false"}></button>
                    <p className={todo.isCompleted ? "title-true" : "title-false"}>{todo.title}</p>
                </div>
            }
            <div className="buttons">
                <button onClick={changeEditMode} className="btn-reset"><svg width="13" viewBox="0 0 313 313" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M200.175 97.2311L52.8282 244.642C48.5508 248.92 48.5508 255.878 52.8282 260.156C54.935 262.263 57.744 263.348 60.553 263.348C63.3621 263.348 66.1711 262.263 68.2779 260.156L215.625 112.809C219.903 108.531 219.903 101.572 215.625 97.295C211.412 92.9537 204.453 92.9537 200.175 97.2311Z" fill="#EA5959"/><path d="M275.253 122.449C278.062 122.449 280.872 121.363 282.978 119.257L299.066 103.169C317.644 84.5905 317.644 54.3933 299.066 35.8792L277.105 13.9175C268.103 4.91583 256.165 0 243.46 0C230.756 0 218.817 4.97967 209.815 13.9175L193.727 30.0057C189.45 34.2831 189.45 41.2419 193.727 45.5193L267.529 119.321C269.635 121.363 272.444 122.449 275.253 122.449ZM225.329 29.3034C230.181 24.4515 236.629 21.7701 243.524 21.7701C250.355 21.7701 256.867 24.4515 261.719 29.3034L283.681 51.2651C293.704 61.2883 293.704 77.5679 283.681 87.5911L275.253 96.0183L216.902 37.6667L225.329 29.3034Z" fill="#EA5959"/><path d="M103.966 298.206L259.421 142.751C263.698 138.473 263.698 131.514 259.421 127.237C255.143 122.96 248.184 122.96 243.907 127.237L91.1333 280.138L23.7163 289.204L32.7818 221.787L178.724 75.8442C183.002 71.5668 183.002 64.608 178.724 60.3306C174.447 56.0532 167.488 56.0532 163.211 60.3306L14.7145 208.955C12.9908 210.678 11.9055 212.849 11.5863 215.211L0.0947425 300.504C-0.352151 303.888 0.797004 307.271 3.223 309.697C5.26594 311.74 8.07498 312.889 10.9479 312.889C11.4586 312.889 11.9055 312.825 12.4162 312.762L97.709 301.27C100.071 301.015 102.306 299.929 103.966 298.206Z" fill="#EA5959"/></svg></button>
                <button onClick={() => deleteTask(todo)} className="btn-reset"><svg width="13" viewBox="0 0 234 315" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M215.993 23.942H151.157V17.477C151.157 7.841 143.413 0 133.894 0H99.546C90.025 0 82.28 7.841 82.28 17.478V23.943H17.445C7.826 23.943 0 31.703 0 41.24V52.669C0 59.837 4.42 65.999 10.698 68.62C12.687 108.243 24.198 299.813 24.716 308.421C24.938 312.117 28 315.001 31.703 315.001H201.736C205.439 315.001 208.502 312.117 208.723 308.421C209.241 299.814 220.751 108.243 222.741 68.62C229.019 65.999 233.439 59.837 233.439 52.669V41.239C233.439 31.702 225.613 23.942 215.993 23.942V23.942ZM96.28 17.478C96.28 15.56 97.745 14 99.546 14H133.894C135.694 14 137.158 15.56 137.158 17.478V23.943H96.281V17.478H96.28ZM13.998 41.239C13.998 39.421 15.544 37.942 17.443 37.942H215.992C217.891 37.942 219.437 39.42 219.437 41.239V52.668C219.437 54.487 217.891 55.967 215.992 55.967H17.444C15.545 55.967 13.999 54.488 13.999 52.668V41.239H13.998ZM195.141 301H38.293C36.238 266.753 26.814 109.326 24.783 69.967H208.65C206.619 109.326 197.196 266.753 195.141 301V301Z" fill="#EA5959"/><path d="M116.719 95.125C112.853 95.125 109.719 98.259 109.719 102.125V278.234C109.719 282.1 112.853 285.234 116.719 285.234C120.585 285.234 123.719 282.1 123.719 278.234V102.125C123.719 98.259 120.585 95.125 116.719 95.125V95.125Z" fill="#EA5959"/><path d="M69.419 102.04C69.217 98.18 65.912 95.203 62.064 95.415C58.204 95.616 55.237 98.9089 55.439 102.77L64.621 278.599C64.816 282.335 67.906 285.234 71.605 285.234C71.728 285.234 71.852 285.231 71.976 285.224C75.836 285.023 78.803 281.73 78.601 277.869L69.419 102.04V102.04Z" fill="#EA5959"/><path d="M171.374 95.415C167.475 95.192 164.221 98.179 164.019 102.04L154.835 277.869C154.633 281.73 157.6 285.023 161.46 285.224C161.585 285.231 161.708 285.234 161.831 285.234C165.529 285.234 168.62 282.336 168.815 278.599L177.999 102.77C178.201 98.909 175.235 95.616 171.374 95.415V95.415Z" fill="#EA5959"/></svg></button>
            </div>
        </div>
    )
}