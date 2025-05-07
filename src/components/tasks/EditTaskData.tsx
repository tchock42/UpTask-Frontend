// componente que muestra el modal de editar tarea y gestiona el se actualice la tarea
import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getTaskById } from "@/services/TaskServices"
import EditTaskModal from "./EditTaskModal"
const EditTaskData = () => {

    // recuperar el projectId
    const params = useParams()
    const projectId = params.projectId!     // ! para que pueda ser null
    // recuperar el taskId
    const location = useLocation()
    const queryparams = new URLSearchParams(location.search)
    
    const taskId = queryparams.get('editTask')!           // extrae el id del query 
    
    const {data, isError} = useQuery({   // obtención de la tarea para ser actualizada
        queryKey: ['task', taskId], // almacena en chache los datos de la tarea con su taskId
        queryFn: () => getTaskById({projectId, taskId}), // solo acepta un objeto, o una funcion
        enabled: !!taskId,       // realiza la consulta hasta que se tenga un taskId en la url
        retry: 1
    })
    if (isError) return <Navigate to={'/404'} />        // si la url es equivocada
    if(data) return <EditTaskModal data = {data} taskId = {taskId} />
}

export default EditTaskData
