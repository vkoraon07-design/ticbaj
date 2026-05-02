import React, { useState } from 'react'
import './Style.css'
import Header from './Header'
import { ToastContainer, toast } from 'react-toastify'
import BottomMenu from './Bottommenu'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from './firebase'
import { doc, setDoc} from "firebase/firestore"

function Register() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()


    const handleClick = async () => {
        if (!email.trim() || !password.trim() || !phone.trim() || !confirmPassword.trim() || !username.trim()) {
            toast.info('Field is empty')
            return
        }
        if (password === confirmPassword) {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                toast.info('SignUp Successfully')
                console.log("User Created:", userCredential.user);
                const user = userCredential.user
                await setDoc(doc(db, "users", user.uid), {
                    Name: username,
                    Password: password,
                    Email: email,
                    Phone: phone,
                    WAmt: 0,
                    createdAt: new Date(),
                })
                navigate('/Login')

            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error('Password does not match')
        }

    }

    return (
        <>
            <div className='mainui'>
                <Header />
                <div className='login'>
                    <h1>CREATE NEW ACCOUNT</h1>
                    <span>User Name</span>
                    <input type='text'
                        value={username}
                        onChange={((e) => setUsername(e.target.value))}
                        placeholder='Enter your name*' />
                    <span>Email</span>
                    <input type='text'
                        value={email}
                        onChange={((e) => setEmail(e.target.value))}
                        placeholder='Email*' />
                         <span>Phone</span>
                    <input type='text'
                        value={phone}
                        onChange={((e) => setPhone(e.target.value))}
                        placeholder='Phone Number*' />
                    <span>Password</span>
                    <input type='text' value={password}
                        onChange={((e) => setPassword(e.target.value))}
                        placeholder='Password*' />
                    <span>Confirm Password</span>
                    <input type='text' value={confirmPassword}
                        onChange={((e) => setConfirmPassword(e.target.value))}
                        placeholder='Confirm Password*' />


                    <button onClick={handleClick}>REGISTER</button>

                    <p>Already have an account?
                        <Link to='/Login' className='loginlink'> Login</Link>
                    </p>
                </div>
                <div className='recaptcha'>
                    <div id='recaptcha-container'></div>
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

export default Register