import {Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react'
import { TaskProject } from "@/types/index"
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react/jsx-runtime'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/services/TaskServices'
import { toast } from 'react-toastify'
import {useDraggable} from '@dnd-kit/core'

type TaskCardProps = {
    task: TaskProject
    canEdit: boolean
}

const TaskCard = ({task, canEdit}: TaskCardProps) => {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({     // hook para definir un elemento arrastrable
        id: task._id
    })

    const navigate = useNavigate()
    // obtencion del id del projecto para eliminar tarea
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()        // inicializa instancia para invalidar
    const {mutate} = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['project', projectId]
            })
            toast.success(data) 
        }
    })
    
    const style = transform ? {                                             // atributo que agrega estilo y limite de movimiento
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined
    return (
        <li 
            {...listeners}                                  // nodo arrastrable con atrbituos para definir comportamienti
            {...attributes}
            ref={setNodeRef}
            style={style}
            className="p-5 bg-white border border-slate-300 flex justify-between"
        >
            <div className="min-w-0 flex flex-col gap-y-4">
                <button
                    type="button"
                    className="text-xl font-bold text-slate-600 text-left cursor-pointer"
                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                >{task.name}</button>
                <p className="text-slate-500">{task.description}</p>
            </div>
            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9 hover:cursor-pointer" aria-hidden="true" />
                    </MenuButton>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <MenuItems
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>
                                <button 
                                    type='button' 
                                    className='block px-3 py-1 text-sm leading-6 text-gray-900 hover:cursor-pointer'
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </MenuItem>
                            {canEdit && (
                                <>
                                    <MenuItem>
                                        <button 
                                            type='button' 
                                            className='block px-3 py-1 text-sm leading-6 text-gray-900 hover:cursor-pointer'
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >Editar Tarea
                                        </button>
                                    </MenuItem>

                                    <MenuItem>
                                        <button 
                                            type='button' 
                                            className='block px-3 py-1 text-sm leading-6 text-red-500 hover:cursor-pointer'
                                            onClick={() => mutate({projectId, taskId: task._id})}
                                            >
                                            Eliminar Tarea
                                        </button>
                                    </MenuItem>
                                </>
                            )}
                            
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </li>
    )
}

export default TaskCard
