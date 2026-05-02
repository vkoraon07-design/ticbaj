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
  const DepositCash = () => {
    navigate("/DepositCash")
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
          <h1>DEPOSIT CASH</h1>
          <h2><img src={rupee} />{wAmt} </h2>
          <p>Deposit money from upi/bank and play game.</p>
          <button onClick={DepositCash}>DEPOSIT MONEY</button>
        </div>

        <div className='withdrawcash'>
          <h1>WINNING CASH</h1>
          <h2><img src={rupee} />70 </h2>
          <p>Withdraw your money into your bank or Wallet. You can also withdraw your deposited money. </p>
          <button onClick={WithdrawClick}> WITHDRAW MONEY</button>
        </div>
      </div>
      <BottomMenu />
    </>
  )
}

export default WalletPage