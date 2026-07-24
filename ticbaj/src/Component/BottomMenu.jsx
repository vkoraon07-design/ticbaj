import './Style.css'
import House from '../Img/House.png'
import Profile from '../Img/Profilebottom.png'
import rupeeb from '../Img/rupeeb.png'
import withdraw from '../Img/withdraw.png'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { SocketContext } from './Games/SocketContext'


function BottomMenu() {
     const socket = useContext(SocketContext)
     const navigate = useNavigate()

     const home = () => {
          socket?.emit("leaveQueue")
          navigate("/")
     }
     const profile = () => {
          socket?.emit("leaveQueue")
          navigate("/Profile")
     }
     const addMoney = () => {
          socket?.emit("leaveQueue")
          navigate("/DepositCash")
     }
     const Withdraw = () => {
          socket?.emit("leaveQueue")
          navigate("/Withdraw")
     }

     return (
          <>
               <div className='bottommenu'>
                    <div onClick={home} className='linkit'>
                         <img src={House} />
                         <span>Home</span>
                    </div>
                    <div onClick={profile} className='linkit'>
                         <img src={Profile} />
                         <span>Profile</span>
                    </div>
                    <div onClick={addMoney} className='linkit'>
                         <img src={rupeeb} />
                         <span>Add Money</span>
                    </div>
                    <div onClick={Withdraw} className='linkit'>
                         <img src={withdraw} />
                         <span>Withdraw</span>
                    </div>
               </div>
          </>
     )
}

export default BottomMenu