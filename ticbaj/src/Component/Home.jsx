import React, { useEffect, useState } from 'react'
import BottomMenu from './Bottommenu'
import Header from './Header'
import './Style.css'
import tictac from '../Img/tictac.png'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { toast, ToastContainer } from 'react-toastify'
import { db } from "./firebase"


function Home() {
  const [info, setInfo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "headinfo", "headinfodoc")
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfo(docSnap.data())
        } else {
          toast.info('Info is not available')
        }

      } catch (error) {
        toast.error("Data not found, something went wrong.")
      }
    }
    fetchData();
  }, [])


  return (
    <>
      <div className='mainui'>
        <Header />
        <div className='infocard'>
          <p>{info.Info}</p>
        </div>
        <div className='gamecontainer'>
          <Link to='/BattleList' className='tictaccard'>
            <img src={tictac} />
          </Link>
        </div>
        <Link to='/TicTacToe'>TicTacToe</Link>
        <ToastContainer
          position='bottom-center'
          autoClose={2000}
          closeOnClick={false}
          theme="light"
          limit={1}
        />
      </div>
      <BottomMenu />
    </>
  )
}

export default Home