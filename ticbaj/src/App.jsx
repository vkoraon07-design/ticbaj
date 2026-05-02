import { useState } from 'react'
import Home from './Component/Home'
import Profile from './Component/Profile'
import AddMoney from './Component/AddMoney'
import WalletPage from './Component/WalletPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Withdraw from './Component/Withdraw'
import DepositCash from './Component/DepositCash'
import Register from './Component/Register'
import Login from './Component/Login'
import BattleList from './Component/BattleList'
import TicTacToe from './Component/Games/TicTacToe'
import { SocketContext } from './Component/Games/SocketContext'
import {socket} from './Component/Games/Socket'

function App() {
  return (
    <>
      <BrowserRouter>
        <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/AddMoney" element={<AddMoney />} />
          <Route path="/WalletPage" element={<WalletPage />} />
          <Route path="/Withdraw" element={<Withdraw />} />
          <Route path="/DepositCash" element={<DepositCash />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/BattleList" element={<BattleList />} />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
        </SocketContext.Provider>
      </BrowserRouter>


    </>
  )
}

export default App
