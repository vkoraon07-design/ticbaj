import React, { useState } from 'react'
import './Style.css'
import Header from './Header'
import BottomMenu from './Bottommenu'

function Withdraw() {
  const [Value, setValue] = useState("")


  const btn = (amt) =>{
         setValue(amt.toString())
    
  }

  return (
     <>
    <div className='mainui'>
        <Header/>
        <div className='withdrawform'>
           <h1>WITHDRAW MONEY</h1>
           <span>Enter Amount</span>
           <input type='number' value={Value} onChange={(e)=> setValue(e.target.value)} placeholder='Enter Amount'/>
           <div className='amountbtn'>
           <button onClick={() => btn(100)} className='btn'>100</button>
           <button onClick={() => btn(200)} className='btn'>200</button>
           <button onClick={() => btn(1000)} className='btn'>1000</button>
           <button onClick={() => btn(2000)} className='btn'>2000</button>
          
           </div>
           <button className='Wbtn'>WITHDRAW MONEY</button>
           <p><b>Note:</b> (You can withdraw <b>200</b> rupees minimum and maximum <b>25,000</b> rupees in a day)</p>
        </div>
    </div>
    <BottomMenu/>
    </>
  )
}

export default Withdraw