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
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import TimeOutPopup from './TimeOutPopup'
import { reload } from 'firebase/auth'



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
  const Initial_time = 20
  const [timeLeft, setTimeLeft] = useState(Initial_time)
  const [timeOut, setTimeout] = useState(false)
  const [timeOutPopup, setTimeoutPopup] = useState(false)
  const [wonmsg, setWonMsg] = useState()
  const oppoIntial_time = 20
  const [oppoTimeLeft, setOppoTimeLeft] = useState(oppoIntial_time)
  const [wAmt, setWamt] = useState()
  const [prizeGiven, setPrizeGiven] = useState(false)
  const [oppoDisconnected, setOppoDisconnected] = useState()





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
          setWamt(docSnap.data().WAmt)
        } else {
          toast.info("No user data found!");
        }
      } catch (error) {
        toast.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [])


  socket?.on("opponentDisconnected", async (data) => {
    const user = auth.currentUser
    if (!user) return
    const prizeMoney = state?.prizemoney || 0;
    if (!data.gameEnd) {
      setOppoDisconnected(`Opponenet left, You won - ${prizeMoney} rupees`)
      await updateDoc(doc(db, "users", user.uid), {
        WAmt: wAmt + prizeMoney
      })
      setTimeoutPopup(true)
    }
  })

  useEffect(() => {
    if (finishedState) {
      socket?.emit("gameEnded", {
        gameEnd: finishedState
      })
    }
  }, [finishedState])



  useEffect(() => {
    setTimeLeft(Initial_time)
  }, [currentPlayer])

  useEffect(() => {
    if (currentPlayer !== playingAs) return
    if (timeLeft === 0) {
      socket?.emit("timeout", {
        Wonalert: `You won - ${state?.prizemoney} rupees`
      })
      socket.disconnect();
      setTimeout(true)
      setTimeoutPopup(true)
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [currentPlayer, playingAs, timeLeft])


  socket?.on("timeoutinfo", async (data) => {
    const user = auth.currentUser
    if (!user) return
    const timeOutWon = state?.prizemoney || 0;
    const wonalert = data.Wonalert
    if (wonalert) {
      setTimeoutPopup(true)
      setWonMsg(wonalert)
      await updateDoc(doc(db, "users", user.uid), {
        WAmt: wAmt + timeOutWon
      })
    }
  })

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket?.emit("leaveQueue")
      socket.disconnect()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    };
  }, [])

  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handleBack = () => {
      console.log("back pressed")
      socket?.disconnect()
      window.history.pushState(null, "", window.location.href)
    }
    window.addEventListener("popstate", handleBack)
    return () => {
      window.removeEventListener("popstate", handleBack)
    }
  }, [])

  useEffect(() => {
    if (currentPlayer === playingAs) return;
    if (oppoTimeLeft === 0) return

    const timer = setInterval(() => {
      setOppoTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)

  }, [oppoTimeLeft, currentPlayer, playingAs])

  useEffect(() => {
    if (currentPlayer !== playingAs) {
      setOppoTimeLeft(oppoIntial_time)
    }

  }, [currentPlayer, playingAs])


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
      setFinishedArrayState([0, 4, 8])
      return gameState[0][0]
    }
    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      setFinishedArrayState([2, 4, 6])
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



  useEffect(() => {
    const prizeDistribute = async () => {
      if (prizeGiven) return
      const user = auth.currentUser
      if (!user) return
      if (finishedState === playingAs) {
        const prizeMoney = state?.prizemoney || 0;
        await updateDoc(doc(db, "users", user.uid), {
          WAmt: wAmt + prizeMoney,
        })
        setPrizeGiven(true)
      } else if (finishedState === "Draw") {
        const drawBtn = state?.BtnNum || 0;
        await updateDoc(doc(db, "users", user.uid), {
          WAmt: wAmt + drawBtn
        })
        setPrizeGiven(true)
      }
    }
    prizeDistribute()
  }, [finishedState, wAmt, state?.prizemoney, state?.BtnNum, prizeGiven, playingAs])

  const homeClick = () => {
    socket?.disconnect()
    navigate("/")
    window.location.reload()
  }

  return (
    <>
      <div className='gamebackground'>

        <div className='gamebg'>
          <button onClick={homeClick} className='backbtn'><img src={home} /></button>


          <div className='prizetop'>
            <img src={prizes} />
            <p>Prize Pool &#8377;{state?.prizemoney}</p>
          </div>
          <div className={currentPlayer === playingAs ? "timeLeft" : "oppotTimeLeft"}>
            00:{timeLeft}
          </div>
          <div className='mainProfile'>
            <div className={currentPlayer === playingAs ? 'profileOutline' : 'profileOnline'}>
              <div className='profileOnline'>
                <div className='xprofile'><b>{playingAs}</b></div>
                <span>{userName.Name}</span>
              </div>
            </div>

            <div className={currentPlayer !== playingAs ? "oppoTimeShow" : ""}>
              00:{oppoTimeLeft}
            </div>
            <div className={currentPlayer !== playingAs ? 'profileOutline' : 'profileOnline'}>
              <div className='profileOnline'>
                <div className='xprofile'><b>{playingAs === "O" ? "X" : "O"}</b></div>
                <span>{state?.opponentName}</span>
              </div>
            </div>
          </div>
          <div className={playingAs === currentPlayer ? 'turninfo' : 'oppoturninfo'}>
            {playingAs === currentPlayer ? 'Your Turn' : "Opponent's Turn"}
          </div>


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
          <PopupCard finishedState={finishedState} />
          <TimeOutPopup
            timeOutPopup={timeOutPopup}
            finishedState={finishedState}
            wonmsg={wonmsg}
            oppoDisconnected={oppoDisconnected}
          />

        </div>
        <ToastContainer
          position='bottom-center'
          autoClose={2000}
          closeOnClick={false}
          theme="light"
          limit={1}
        />
      </div>

    </>
  )
}

export default TicTacToe