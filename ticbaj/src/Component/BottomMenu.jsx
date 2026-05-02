import React from 'react'
import './Style.css'
import House from '../Img/House.png'
import Profile from '../Img/Profilebottom.png'
import rupeeb from '../Img/rupeeb.png'
import withdraw from '../Img/withdraw.png'
import{Link} from 'react-router-dom'

function BottomMenu() {
  return (
    <>
    <div className='bottommenu'>
     <Link to="/" className='linkit'>
          <img src={House}/>
             <span>Home</span>
        </Link>
        <Link to="/Profile" className='linkit'>
           <img src={Profile}/>
             <span>Profile</span>
        </Link>
        <Link to="/AddMoney" className='linkit'>
             <img src={rupeeb}/>
             <span>Add Money</span>
        </Link>
        <Link to="/Withdraw" className='linkit'>
            <img src={withdraw}/>
             <span>Withdraw</span>
        </Link>
    </div>
    </>
  )
}

export default BottomMenu