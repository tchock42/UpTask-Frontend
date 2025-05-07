import { useAuth } from "@/hooks/useAuth"
import { deleteNote } from "@/services/NoteService"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}
const NoteDetail = ({note}: NoteDetailProps) => {

    const {data, isLoading} = useAuth() // carga la información de la sesion actual
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])   // booleano, true si coincide el user de data con el de note
    
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)    
    // informacion para mutation
    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    if(isLoading) return 'Cargando'
        
    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>    

            {canDelete && (
                <button
                onClick={ () => mutate({projectId, taskId, noteId: note._id})} // como callback para que no se ejecuta inmediatamente
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer rounded-sm"
                >Eliminar</button>
            )}
        </div>
    )
}

export default NoteDetail
