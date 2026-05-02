import React from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'
import upilogos from '../Img/upilogos.png'
import { Link } from 'react-router-dom'

function AddMoney() {
  return (
    <>
      <div className='mainui'>
        <Header />
          <h1>DEPOSIT MONEY</h1>
          <Link to='/DepositCash' className='upicard'>
            <img src={upilogos} />
            <div className='upibox'>
              <span>ADD BY BANK/UPI</span>
              <p>Add Cash & Play</p>
            </div>
          </Link>
      </div>
      <BottomMenu />
    </>
  )
}

export default AddMoney