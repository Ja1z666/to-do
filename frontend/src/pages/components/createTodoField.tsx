import axios from "axios";
import { useState } from "react"

export function CreateTodoField({getTask, folder}:any){
    const [title, setTitle] = useState('')

	const addTodo = async (title:string) => {
        if(!title) return;
        let date = "" + (Date.now() + (1440 * 60 * 1000));
		await axios({
            method: "POST",
            data: {
                id: folder,
                title,
                date
            },
            withCredentials: true,
            url: "http://localhost:4000/createTask"
        });
		setTitle('');
        getTask(folder);
	}
    return(
		<input type='text' onChange={e => setTitle(e.target.value)} value={title} onKeyPress={e => e.key === 'Enter' && addTodo(title)} placeholder='Add a task' />
    )
}