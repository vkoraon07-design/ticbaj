import React, { useEffect, useState } from 'react'
import './Style.css'
import { useNavigate, Link } from 'react-router-dom'
import rupee from '../Img/rupee.png'
import { db, auth } from "./firebase"
import { ToastContainer, toast } from 'react-toastify'
import { doc, getDoc } from "firebase/firestore"



function Header() {
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

  return (
    <div className='header'>
      <Link to='/' className='title'>TICBAJ</Link>
        <Link to="/WalletPage" className='wallet'>
          <img src={rupee} />
          {wAmt}
        </Link>
    

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