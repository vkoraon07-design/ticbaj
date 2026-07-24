import React, { useEffect, useState } from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'
import { useNavigate, Link } from 'react-router-dom'
import rupee from '../Img/rupee.png'
import DepositCash from './DepositCash'
import { db, auth } from "./firebase"
import { ToastContainer, toast } from 'react-toastify'
import { doc, getDoc } from "firebase/firestore"

function WalletPage() {
  const navigate = useNavigate()
  const [wAmt, setWamt] = useState()

  useEffect(() => {
    const user = auth.currentUser; // current logged-in user
    if (!user) {
      navigate('/Login')
    }
  })

  const WithdrawClick = () => {
    navigate("/Withdraw")
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
    <>
      <div className='mainui'>
        <Header />
        <div className='depositcash'>
          <div className='wbalance'>
            <h1>Balance</h1>
            <h2>&#8377;{wAmt} </h2>
          </div>
          <button onClick={WithdrawClick}> WITHDRAW </button>
        </div>

      </div>
      <BottomMenu />
    </>
  )
}

export default WalletPage