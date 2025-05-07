import { Link, Navigate, Outlet } from "react-router-dom"
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import {ToastContainer} from 'react-toastify'   // componente de toast
import 'react-toastify/ReactToastify.css'       // estilos
import { useAuth } from "@/hooks/useAuth"

const AppLayout = () => {

    const {data, isError, isLoading} = useAuth()
    
    if(isLoading) return 'Cargando...';
    if(isError){
        return <Navigate to='/auth/login' />
    }

    if( data )return (
        <>
            <header className="bg-gray-800 py-5">
                <div className="container mx-auto sm:max-w-full lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">  {/*256px*/}
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>
                    <NavMenu
                        name = {data.name}
                    />
                </div>
            </header>
            
            <section className="max-w-screen-xl mx-auto mt-10 p-5">
                <Outlet/>
            </section>

            <footer className="py-5">
                <p className='text-center'>Todos lo Derechos Reservados {new Date().getFullYear()}</p>
            </footer>
            <ToastContainer 
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}

export default AppLayout
