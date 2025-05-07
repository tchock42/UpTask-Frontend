import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '@/services/TaskServices'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}
type GroupedTasks = {   // type para agrupar las tareas por estado
    [key: string]: TaskProject[],  // key es un string y el valor es un arreglo de tareas
}

const initialStatusGroups: GroupedTasks = {   // objeto con los valores iniciales de los estados de las tareas
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const statusStyles:{[key: string]: string} = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500'
}

const TaskList = ({tasks, canEdit}: TaskListProps) => {
    const queryClient=useQueryClient() 
    const params = useParams()
    const projectId = params.projectId!

    /**  codigo de dnd-kit */
    const mouseSensor = useSensor(MouseSensor, {            
        activationConstraint: {                   
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);
    const {mutate} = useMutation({                              // mutación para 
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['project', projectId]})   // actualizar el proyecto
        }
    })
    
    
    /** termina código de dnd-kit */

    const groupedTasks = tasks.reduce((acc, task) => {      // agrupacion de tareas por estado | (acumulador {}, tarea {}). acc empieza como un {} vacío
        
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];   // si no existe el estado, se crea un arreglo vacio | si ya existe, se obtiene el arreglo de la copia de las tareas por estado
        currentGroup = [...currentGroup, task]                              // se agrega la tarea actual al arreglo de tareas por estado
        return { ...acc, [task.status]: currentGroup };         // se retorna el objeto con las tarea por estados agrupadas por cada tarea, por ejemplo {pending: [{status: 'pending', name: 'Task 1']}
    }, initialStatusGroups);                                                     // se inicializa el objeto con los valores iniciales de los estados de las tareas de initialStatusGroups
    // el return dentro del reduce va devolviendo el objeto con las tareas agrupadas por estado y las guarda en acc
    // console.log(groupedTasks)

    const handleDragEnd = (e: DragEndEvent) =>{                 // handler para manejar el evento de soltar el elemento arrastrable
        const {over, active} = e
        if(over && over.id){                // si se arrastra a un nodo válido
            const taskId = active.id.toString()        // antes tenía un type taskId: UniqueIdentifier
            const status = over.id as TaskStatus

            mutate({projectId, taskId, status})         // realiza la peticion para avtualizar el status
            // actualización optimista, para no esperarse hasta el invalidateQuery y se actualice mas rápido despues del drag-drop
            queryClient.setQueryData(['project', projectId], (prevData:Project) => {    // toma la consulta del proyecto y sus valores anteriores antes del drag-drop
                const updatedTask = prevData.tasks.map((task) => {              // itera en el array de tareas
                    if(task._id === taskId){    // si la tarea actual es igual a la tarea arrastrada
                        return {                    
                            ...task,            // retorna la tarea actual con el status destino
                            status
                        }
                    }                               
                    return task                 // si no es la tarea arrastrada, la retorna sin cambios
                })  
                return {                        // return del queryclient
                    ...prevData,                // retorna los valores de la consulta previa, pero con el array de tareas actualizado
                    tasks: updatedTask
                }
            })
        }
    }
    return (
        
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext
                    sensors={sensors}           // sensors es el sensor de mouse y touch
                    onDragEnd={handleDragEnd}
                >
                    {Object.entries(groupedTasks).map(([status, tasks]) => (    // transforma en arreglo de tuplas, cada tupla es un arreglo con el estado y las tareas
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3 
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`} // agrega el valor actual de status como key del objeto statusStyles
                            >{statusTranslations[status]}</h3>     {/** El status actua como una etiqueta de color y titulo para cada estado */}
                            <DropTask status={status}/>            
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit}/>)     // itera en cada grupo de tareas y las despliega
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
        
    )
}

export default TaskList
