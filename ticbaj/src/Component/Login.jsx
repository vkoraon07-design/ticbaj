import React, { useState } from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleClick = async () => {
        if (!email.trim() || !password.trim()) {
            toast.info('Field is empty')
            return
        }
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            toast.success('Logged in successfully')
            navigate('/')
        } catch (error) {
            console.error(error.message);
            toast.error('Enter the correct email & password')
        }
    }
    return (
        <>
            <div className='mainui'>
                <Header />
                <div className='login'>
                    <h1>LOGIN TO PLAY</h1>
                    <span>Email</span>
                    <input type='text'
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)} />

                    <span>Password</span>
                    <input type='text'
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleClick}>LOGIN</button>
                    <p>Don't have an account?
                        <Link to='/Register' className='loginlink'> Register</Link>
                    </p>
                </div>
                <ToastContainer
                    position='bottom-center'
                    autoClose={2000}
                    closeOnClick={false}
                    theme="light"
                    limit={1}
                />
            </div>
            <BottomMenu />
        </>
    )
}

export default Login