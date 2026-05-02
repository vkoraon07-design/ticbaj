import { useState } from 'react'
import React from 'react'
import BottomMenu from './Bottommenu'
import Header from './Header'
import './Style.css'

function DepositCash() {
  const [insert, setInsert] = useState("")


  const btn = (amt) => {
    setInsert(amt.toString())

  }
  return (
    <>
      <div className='mainui'>
        <Header />
        <div className='withdrawform'>
          <h1>DEPOSIT MONEY</h1>
          <span>Enter Amount</span>
          <input type='number' value={insert} onChange={(e) => setInsert(e.target.value)} placeholder='Enter Amount' />
          <div className='amountbtn'>
            <button onClick={() => btn(100)} className='btn'>100</button>
            <button onClick={() => btn(200)} className='btn'>200</button>
            <button onClick={() => btn(500)} className='btn'>500</button>
            <button onClick={() => btn(1000)} className='btn'>1000</button>

          </div>
          <button className='Wbtn'>ADD MONEY</button>
          <p><b>Note:</b> (You can withdraw <b>200</b> rupees minimum and maximum <b>25,000</b> rupees in a day)</p>
        </div>
      </div>
      <BottomMenu />
    </>
  )
}

export default DepositCash