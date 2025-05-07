import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkPassword } from '@/services/AuthService';
import { toast } from 'react-toastify';
import { deleteProject } from '@/services/ProjectService';

export default function DeleteProjectModal() {
    const initialValues: CheckPasswordForm = {
        password: ''
    }
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search);
    const deleteProjectId = queryParams.get('deleteProject')!;
    const show = deleteProjectId ? true : false

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })     // manejo del formulario
    const queryClient = useQueryClient()        // invalidar la consulta de 'projects'

    // primera mutacion para verificar la contraseña
    const checkUserPasswordMutation = useMutation({
        mutationFn: checkPassword,
        onError: (error) => toast.error(error.message)
    })
    //segunda mutación para eliminar el proyecto
    const deleteProjectMutation = useMutation({            // useMutation para
        mutationFn: deleteProject,
        onError: (error) => {                    // retoma error del controlador para mostrarlo
            toast.error(error.message)
        },
        onSuccess: (data) => {  // toma la respuesta del controlador para mostrar mensaje de exito
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['projects']})
            reset()
            navigate(location.pathname, { replace: true})           // cierra el modal quitando el ?deleteProject
        }
    })

    const handleForm = async (formData: CheckPasswordForm) => {
        await checkUserPasswordMutation.mutateAsync(formData)       // continua el flujo de hableForm hasta que se realice la consulta
        await deleteProjectMutation.mutateAsync(deleteProjectId)
    }


    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
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
                                >Eliminar Proyecto </DialogTitle>

                                <p className="text-xl font-bold">Confirma la eliminación del proyecto {''}
                                    <span className="text-fuchsia-600">colocando tu password</span>
                                </p>

                                <form
                                    className="mt-10 space-y-5"
                                    onSubmit={handleSubmit(handleForm)}
                                    noValidate
                                >

                                    <div className="flex flex-col gap-3">
                                        <label
                                            className="font-normal text-2xl"
                                            htmlFor="password"
                                        >Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Password Inicio de Sesión"
                                            className="w-full p-3  border-gray-300 border"
                                            {...register("password", {
                                                required: "El password es obligatorio",
                                            })}
                                        />
                                        {errors.password && (
                                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <input
                                        type="submit"
                                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Eliminar Proyecto'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}