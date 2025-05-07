import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { User } from '../types'
import { useQueryClient } from '@tanstack/react-query'

type NavMenuProps = {
  name: User['name']
}

export default function NavMenu({name}: NavMenuProps  ) {

  const queryClient =useQueryClient()       // instancia el hook de useQueryClient

  const logout = () => {                    // funcion para cerrar sesion  
    localStorage.removeItem('AUTH_TOKEN')   // elimina el token de autenticacion
    queryClient.invalidateQueries({         // invalidar la consulta de ['user]
      queryKey: ['user']})            
  }

  return ( 
    <Popover className="relative">              {/** componente de menu flotante */}
      <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-purple-400 hover:cursor-pointer"> {/** boton de haamburguesa */}
        <Bars3Icon className='w-8 h-8 text-white ' />   {/** icono de barras */}
      </PopoverButton>

      <Transition                           /** componente de transición a los componetes hijos */
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {/** menu flotante */}
        <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">   
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className='text-center'>Hola: {name}</p>
            {/**Subelementos del menu */}
            <Link
              to='/profile'
              className='block p-2 hover:text-purple-950 hover:cursor-pointer'
            >Mi Perfil</Link>
            <Link
              to='/'
              className='block p-2 hover:text-purple-950 hover:cursor-pointer'
            >Mis Proyectos</Link>
            <button
              className='block p-2 hover:text-purple-950 hover:cursor-pointer'
              type='button'
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}