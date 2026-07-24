import React, { useEffect, useState, useContext } from 'react'
import './Style.css'
import { useNavigate, Link } from 'react-router-dom'
import rupee from '../Img/rupee.png'
import { db, auth } from "./firebase"
import { ToastContainer, toast } from 'react-toastify'
import { doc, getDoc } from "firebase/firestore"
import { socket } from './Games/Socket'
import { SocketContext } from './Games/SocketContext'




function Header() {
  const socket = useContext(SocketContext)
  const user = auth.currentUser
  const navigate = useNavigate()
  const [wAmt, setWamt] = useState()

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // current logged-in user

      try {
        const docRef = doc(db, "users", user.uid); // "users" is collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWamt(docSnap.data().WAmt)
        } else {
          toast.info("No user data found!");
        }
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };
    fetchUserData();

  }, []);

  const title = () => {
    socket?.emit("leaveQueue")
    navigate("/")
  }

  const wallet = () => {
    socket?.emit("leaveQueue")
    navigate("/WalletPage")
  }

  return (
    <div className='header'>
      <div onClick={title} className='title'>TICBAJ</div>
      {user ? (
        <div onClick={wallet} className='wallet'>
          &#8377;{wAmt}
        </div>
      ) : (
        ""
      )}



      <ToastContainer
        position='bottom-center'
        autoClose={2000}
        closeOnClick={false}
        theme="light"
        limit={1}
      />
    </div>

  )
}

export default Header