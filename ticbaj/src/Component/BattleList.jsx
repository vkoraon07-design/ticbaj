import React from 'react'
import Header from './Header'
import BottomMenu from './Bottommenu'
import contact from '../Img/contact.png'
import prize from '../img/prize.png'
import money from '../Img/money.png'
import { connect, io } from 'socket.io-client'
import { useState, useContext, useEffect } from 'react'
import { data, useNavigate, Link } from 'react-router-dom'
import { SocketContext } from './Games/SocketContext'
import loading from '../Img/loading.gif'
import { db, auth } from './firebase'
import { disablePersistentCacheIndexAutoCreation, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify'


function BattleList() {
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const [activeBtn, setActiveBtn] = useState(false)
    const [loggedUser, setLoggedUser] = useState('')
    const [wAmt, setWamt] = useState()
    const [BtnNum, setBtnNum] = useState(null)
    const [DataBtn, setDataBtn] = useState()

    //socket count
    const [socketZero, setSocketZero] = useState()
    const [socketFive, setSocketFive] = useState()
    const [socketTen, setSocketTen] = useState()
    const [socketTwenty, setSocketTwenty] = useState()
    const [socketFifty, setSocketFifty] = useState()
    const [socketHundred, setSocketHundred] = useState()
    const [socketFiveHundred, setSocketFiveHundred] = useState()

    //alert massege to all socket
    const [FiveMsg, setFiveMsg] = useState()
    const [TenMsg, setTenMsg] = useState()
    const [TwentyMsg, setTwentyMsg] = useState()
    const [FiftyMsg, setFiftyMsg] = useState()
    const [HundredMsg, setHundredMsg] = useState()
    const [FiveHundredMsg, setFiveHundredMsg] = useState()
    const [practiceBtnMsg, setPracticBtneMsg] = useState()



    console.log(loggedUser.Name)
    const wAmounts = wAmt

    socket?.on('match-found', async (data) => {
        console.log("Match found:", data.playingAs, data.opponentName, data.BtnNum, data.Prize, data.Waiting)
        const user = auth.currentUser
        if (!user) return
        const amtLeft = wAmounts - BtnNum

        if (BtnNum === data.BtnNum && (BtnNum === 0 || BtnNum === 5 || BtnNum === 10 || BtnNum === 20 || BtnNum === 50 || BtnNum === 100 || BtnNum === 500)) {
            navigate('/TicTacToe', {
                state: {
                    opponentName: data.opponentName,
                    playingAs: data.playingAs,
                    prizemoney: data.Prize,
                    BtnNum: BtnNum
                }
            })
            await updateDoc(doc(db, "users", user.uid), {
                WAmt: amtLeft
            })
        } else {
            navigate("/BattleList")
        }
    })

    socket?.on("btnIsActive", (data) => {
        setDataBtn(data.Active)
    })

    useEffect(() => {
        if (DataBtn === 1) {
            setPracticBtneMsg("1P Waiting........")
        }
        if (DataBtn === 5) {
            setFiveMsg("1P Waiting........")
        }
        if (DataBtn === 10) {
            setTenMsg("1P Waiting........")
        }
        if (DataBtn === 20) {
            setTwentyMsg("1P Waiting........")
        }
        if (DataBtn === 50) {
            setFiftyMsg("1P Waiting........")
        }
        if (DataBtn === 100) {
            setHundredMsg("1P Waiting........")
        }
        if (DataBtn === 500) {
            setFiveHundredMsg("1P Waiting........")
        }
    }, [DataBtn])

    useEffect(() => {
        socket?.on("buttonSocketCount", (data) => {
            if (data.BtnNum === 0) {
                setSocketZero(data.socketCount)
            }
            if (data.BtnNum === 5) {
                setSocketFive(data.socketCount)
            }
            if (data.BtnNum === 10) {
                setSocketTen(data.socketCount)
            }
            if (data.BtnNum === 20) {
                setSocketTwenty(data.socketCount)
            }
            if (data.BtnNum === 50) {
                setSocketFifty(data.socketCount)
            }
            if (data.BtnNum === 100) {
                setSocketHundred(data.socketCount)
            }
            if (data.BtnNum === 500) {
                setSocketFiveHundred(data.socketCount)
            }
        })
    }, [])


    console.log(BtnNum)
    const practiceBtn = (number) => {
        const user = auth.currentUser
        setBtnNum(number)
        setActiveBtn(true)
        socket?.emit('reqPlay', {
            playerName: loggedUser.Name,
            uid: user.uid,
            BtnNum: number,
            Prize: 0,
            Active: 1
        })
    }

    const ButtonFive = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 5) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 9.50,
                Active: 5
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }

    const ButtonTen = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 10) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 18,
                Active: 10
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }

    const ButtonTwenty = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 20) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 38,
                Active: 20
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }

    const ButtonFifty = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 50) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 96,
                Active: 50
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }

    const ButtonHundred = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 100) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 190,
                Active: 100
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }

    const ButtonFHundred = (number) => {
        setBtnNum(number)
        const user = auth.currentUser
        if (wAmounts >= 500) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
                uid: user.uid,
                BtnNum: number,
                Prize: 900,
                Active: 500
            })
        } else {
            toast.info('Insufficient balance, please add money')
            socket?.emit("leaveQueue")
        }
    }


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
                    setLoggedUser(docSnap.data());
                    setWamt(docSnap.data().WAmt)
                } else {
                    console.log("No user data found!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();

    }, []);

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
        const handleBeforeUnload = () => {
            socket?.emit("leaveQueue")
            socket.disconnect()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        };
    }, [])

    return (
        <>
            <div className='mainui'>
                <Header />
                <Link to="https://youtu.be/cnWm8dVD2Wo?si=PKWgkewXRNf3rDdn" className="howtoplay">
                    <span>How to play?</span>
                </Link>
                <h1>All Tournaments</h1>
                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketZero}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{practiceBtnMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>Free</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>0.00</span>
                            </div>

                        </div>

                        <div onClick={() => practiceBtn(0)} className={BtnNum === 0 ? 'practiceBtn active' : 'practiceBtn'}>
                            {BtnNum === 0 ? <img src={loading} /> : ''}
                            <span>PRACTICE</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketFive}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{FiveMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>5</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>9.50</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonFive(5)} className={BtnNum === 5 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 5 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketTen}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{TenMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>10</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>18</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonTen(10)} className={BtnNum === 10 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 10 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketTwenty}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{TwentyMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>20</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>38</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonTwenty(20)} className={BtnNum === 20 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 20 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketFifty}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{FiftyMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>50</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>96</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonFifty(50)} className={BtnNum === 50 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 50 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketHundred}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{HundredMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>100</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>190</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonHundred(100)} className={BtnNum === 100 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 100 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>

                <div className='battlecard'>
                    <div className='topdetails'>
                        <span><img src={contact} /> {socketFiveHundred}</span>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span>{FiveHundredMsg}</span>
                    </div>

                    <div className='BattleAmt'>
                        <div className='AmtColumn'>
                            <span>Entry Fee</span>
                            <div className='amtdetails'>
                                <img src={money} />
                                <span>500</span>
                            </div>
                        </div>
                        <div className='AmtColumn'>
                            <span>Prize</span>
                            <div className='amtdetails'>
                                <img src={prize} />
                                <span>900</span>
                            </div>

                        </div>

                        <div onClick={() => ButtonFHundred(500)} className={BtnNum === 500 ? 'playBtn active' : 'playBtn'}>
                            {BtnNum === 500 ? <img src={loading} /> : ''}
                            <span>PLAY</span>
                        </div>
                    </div>
                </div>
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

export default BattleList
