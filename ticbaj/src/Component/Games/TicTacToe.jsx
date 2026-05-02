import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SocketContext } from './SocketContext'
import './TicTacToe.css'
import Square from './Square'
import home from '../../Img/Home.png'
import rupee from '../../Img/rupee.png'
import prizes from '../../Img/prizes.png'
import PopupCard from './PopupCard'
import clock from '../../Img/clock.png'
import profile from '../../Img/gprofile.jpeg'
import { ToastContainer, toast } from 'react-toastify'
import { db, auth } from '../../Component/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'


const ArrayForm = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9]
]


function TicTacToe() {
  const socket = useContext(SocketContext)
  const [gameState, setGameState] = useState(ArrayForm)
  const [currentPlayer, setCurrentPlayer] = useState('O')
  const [userName, setUserName] = useState('')
  const [finishedState, setFinishedState] = useState(false)
  const [finishedArrayState, setFinishedArrayState] = useState([])
  const { state } = useLocation()
  const location = useLocation()
  const { playingAs } = location.state || {}
  const navigate = useNavigate()


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
          setUserName(docSnap.data());
        } else {
          toast.info("No user data found!");
        }
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);






  socket?.on('opponentLeftMatch', () => {
    alert('opponent left the match')
    setFinishedState(true)
  })

  socket?.on('ServerMove', (data) => {
    const id = data.state.id
    setGameState(prevState => {
      let newState = [...prevState]
      const rowIndex = Math.floor(id / 3)
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign
      return newState

    })
    setCurrentPlayer(data.state.sign === 'O' ? 'X' : 'O')
  })
  

  const checkWinner = () => {
    //row dynamic
    for (let row = 0; row < gameState.length; row++) {
      if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2])
        return gameState[row][0]
      }
    }
    //column dynamic
    for (let col = 0; col < gameState.length; col++) {
      if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col])
        return gameState[0][col]
      }
    }

    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      return gameState[0][0]
    }
    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      return gameState[0][2]
    }

    const isDrawMatch = gameState.flat().every((e) => {
      if (e === 'O' || e === 'X')
        return true
    })

    if (isDrawMatch) return 'Draw'
    return null
  }
  useEffect(() => {
    const winner = checkWinner()
    if (winner) {
      setFinishedState(winner)
    }

  }, [gameState])



  return (
    <>
      <div className='gamebackground'>

        <div className='gamebg'>
            <button className='backbtn'><img src={home} /></button>
          

          <div className='prizetop'>
            <img src={prizes} />
            <h1>PRIZE POOL</h1>
            <div className='pwrapper'>
              <img src={rupee} />
              <span>9.50</span>
            </div>
          </div>
          <div className='mainProfile'>
            <div className={state?.playingAs === 'O' ? 'profileOnline' : 'profileOutline'}>
              <div className='profileOnline'>
                <img src={profile} />
                <span>{userName.Name}</span>
              </div>
            </div>
            <div className={state?.playingAs === "X" ? 'profileOnline' : 'profileOutline'}>
              <div className='profileOnline'>
                <img src={profile} />
                <span>{state?.opponentName}</span>
              </div>
            </div>
          </div>

          <h1>You are playing against {state?.opponentName}</h1>


          <div className='main-wrapper'>
            <div className='square-wrapper'>
              {gameState.map((arr, rowIndex) => (
                arr.map((e, colIndex) => {
                  return <Square
                    playingAs={playingAs}
                    gameState={gameState}
                    finishedArrayState={finishedArrayState}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    setGameState={setGameState}
                    finishedState={finishedState}
                    id={rowIndex * 3 + colIndex}
                    key={rowIndex * 3 + colIndex}
                    currentElement={e} />
                })
              ))}
            </div>
          </div>
          <PopupCard
            finishedState={finishedState} />
        </div>
      </div>

    </>
  )
}

export default TicTacToe