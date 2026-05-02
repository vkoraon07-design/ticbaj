import React, { useEffect, useState } from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'
import Profilebottom from '../Img/Profilebottom.png'
import { ToastContainer, toast } from 'react-toastify'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc, collection, onSnapshot, setDoc } from "firebase/firestore"
import { db, auth } from "./firebase"
import { useNavigate, Link } from 'react-router-dom'


function Profile() {
    const [user, setUser] = useState('')
    const [nameChange, setNameChange] = useState('')
    const navigate = useNavigate()


    const handleNameChange = async () => {
        const user = auth.currentUser
        if (!user) return
        await updateDoc(doc(db, "users", user.uid), {
            Name: nameChange
        })
        toast.info('Name changed successfully')

    }

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser; // current logged-in user
            if (!user) {
                navigate('/Login')
            }
            try {
                const docRef = doc(db, "users", user.uid); // "users" is collection
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                    setNameChange(docSnap.data().Name)
                } else {
                    toast.info("No user data found!");
                }
            } catch (error) {
                toast.error("Error fetching user data:", error);
            }
        };
        fetchUserData();

    }, []);



    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                toast.info("User logged out");
                navigate("/Login");
            })
            .catch((error) => {
                toast.error(error);
            });
    }



    return (
        <>
            <div className='mainui'>
                <Header />

                <div className='profilecard'>
                    <img scr={Profilebottom} />
                    <div className='profilename'>
                        <span>Full Name</span>
                        <input type='text' value={nameChange} placeholder='Name' maxLength='15'
                            onChange={(e) => setNameChange(e.target.value)} />
                        <button onClick={handleNameChange} className='editname'>CHANGE NAME</button></div>
                </div>
                <div className='emailSpace'>
                    <span><b>Email: </b>{user.Email}</span>
                    <span><b>Phone: </b>{user.Phone}</span>
                </div>

                <button onClick={handleLogout} className='logout'>LOGOUT</button>

            </div>
             <ToastContainer
                      position='bottom-center'
                      autoClose={2000}
                      closeOnClick={false}
                      theme="light"
                      limit={1}
                    />
            <BottomMenu />


        </>
    )
}

export default Profile