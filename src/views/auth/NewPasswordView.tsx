import NewPasswordToken from '@/components/auth/NewPasswordToken'
import NewPasswordForm from '@/components/auth/NewPasswordForm'
import {useState} from 'react'
import { ConfirmToken } from '@/types/index'

const NewPasswordView = () => {
  const [token, setToken] = useState<ConfirmToken['token']>('')
  const [isValidToken, setIsValidToken] = useState(false)       // state para saber si es valido el token
  return (

    <>
      <h1 className='text-5xl font-black text-white'>Reestablecer Contraseña</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste en tu 
        <span className='text-fuchsia-500 font-bold'>correo electrónico</span>
      </p>
      {!isValidToken ? 
        <NewPasswordToken token= {token} setToken = {setToken} setIsValidToken = {setIsValidToken}/> : 
        <NewPasswordForm token = {token}/>}
    </>
  )
}

export default NewPasswordView
