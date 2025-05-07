import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { createTask } from '@/services/TaskServices';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
    const navigate = useNavigate()  // instancia navegacion

    /** leer si modal existe */
    const location = useLocation()  
    const queryParams = new URLSearchParams(location.search)    //obtiene el elemento search el cual se detecta lo que empieza con ?
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    /** obtener projectId */
    const params = useParams()
    const projectId = params.projectId!

    const initalValues: TaskFormData = {    // valores iniciales del fomrulario
        name:  '',
        description: ''
    } 
    const queryClient = useQueryClient()    // inicializa la instancia de useQueryClient para invalidar el proyecto

    const {mutate} = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)      // despliega el error de la api
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
        }
    })

    const {register, handleSubmit, reset, formState:{errors}} = useForm({defaultValues: initalValues}) //se crea un objeto con los valores iniciales

    const handleCreateTask = (formData: TaskFormData) => {   // al dac clic al boton del formulario se ejecuta el mutate hacia el createTask
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }   

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={ () => navigate(location.pathname, {replace: true}) }> {/** retira el query string de la url */}
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>
                                    <form 
                                        className='mt-10 space-y-3'
                                        onSubmit= { handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                            <TaskForm 
                                                errors= {errors}
                                                register = {register}
                                            />
                                        <input 
                                            type="submit" 
                                            className='bg-fuchsia-600 hover:bg-fuchsia-700 w-full py-3 text-white uppercase font-bold cursor-pointer transition-colors'
                                            value="Guardar Tarea"    
                                        />
                                    </form>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}