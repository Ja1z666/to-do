import axios from "axios";
import { useState } from "react"

export function CreateTodoField({getTask, folder}:any){
    const [title, setTitle] = useState('')

	const addTodo = async (title:string) => {
		await axios({
            method: "POST",
            data: {
                id: folder,
                title
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