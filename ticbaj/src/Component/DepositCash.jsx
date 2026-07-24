import { useEffect, useState } from 'react'
import React from 'react'
import BottomMenu from './Bottommenu'
import Header from './Header'
import './Style.css'
import { Link, useNavigate } from 'react-router-dom'
import { db, auth } from "./firebase"
import UPI from '../Img/Upi.jpeg'
import WhatsApp from '../Img/WhatsApp.png'

function DepositCash() {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // current logged-in user
      if (!user) {
        navigate('/Login')
      }
    }
    fetchUserData()
  }, [])

  return (
    <>
      <div className='mainui'>
        <Header />
        <div className='DepositeCash'>
          <img src={UPI} />
          <span>UPI ID: vkoraon07@axl</span>
          <p>Pay by scanner or copy the UPI ID and after payment
            successful send the payment successful screenshot, Username & Email in WhatsApp group - Ticbaj,
            amount will be added within a few minutes.
          </p>
        </div>
        <Link to="https://chat.whatsapp.com/EjoqatwVFEPFAuJgjYDn9H" className='WhatsAppC'>
          <img src={WhatsApp} />
          <h1>Join Now! Ticbaj Group</h1>
        </Link>
      </div>
      <BottomMenu />
    </>
  )
}

export default DepositCash