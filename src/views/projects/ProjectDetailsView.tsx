import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { getFullProject } from "@/services/ProjectService";
import { isManager } from "@/utils/policies";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";


const ProjectDetailsView = () => {
    const {data: user, isLoading: authLoading} = useAuth()          // importa la informa
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!        // se obtiene el id como se nombre en el router. El ! indica que no puede ser undefined
    
    const { data, isLoading, isError } = useQuery({  // extrae los datos GET, si está cargando, el error y si hay error
        queryKey: ['project', projectId], // Key unico de la consulta y el ID del proyecto a buscar
        queryFn: () => getFullProject(projectId), // Función con su argumento 
        retry: false                              // No reintentar la consulta
    });
    
    // determinar si el usuario es manager, antes de condicionales
    const canEdit = useMemo( () => data?.manager === user?._id, [data, user]) // al cambio de data y user se evalua si el usuario es manager y se asigna a canEdit
    // console.log(data)
    // console.log(user)
    if(isLoading && authLoading) return 'Cargando'           // si está cargando, muestra cargando en el documento
    if(isError) return <Navigate to='/404'/>  // si hay error, redirecciona a 404
    if(data && user) return (                          // si la consulta trae el proyecto
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>
            { isManager(data.manager, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        onClick={() => navigate('?newTask=true')}           // agrega al final de la url 'newTask=true' para disparar el modal
                    >Agregar Tarea</button>

                    <Link 
                        to= {'team'}            // redirige a /projects/projectId/team
                        className= "bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Colaboradores
                    </Link>
                </nav>
            )}
            
            <TaskList
                tasks = {data.tasks}     // pasa unicamente las tareas del proyecto consultado
                canEdit = {canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}

export default ProjectDetailsView