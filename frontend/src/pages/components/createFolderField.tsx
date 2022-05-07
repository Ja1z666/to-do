import axios from "axios";
import { useState } from "react"

export function CreateFolderField({getFolder}:any){
    const [title, setTitle] = useState('')

	const addFolder = async (title:string) => {
        if(!title) return;
		await axios({
            method: "POST",
            data: {
                title
            },
            withCredentials: true,
            url: "http://localhost:4000/createFolder"
        });
		setTitle('');
        getFolder();
	}
    return(
		<input className="create-folder" type='text' onChange={e => setTitle(e.target.value)} value={title} onKeyPress={e => e.key === 'Enter' && addFolder(title)} placeholder='Create folder' />
    )
}