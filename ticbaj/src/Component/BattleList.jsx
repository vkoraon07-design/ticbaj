import React from 'react'
import Header from './Header'
import BottomMenu from './Bottommenu'
import contact from '../Img/contact.png'
import prize from '../img/prize.png'
import money from '../Img/money.png'
import { connect, io } from 'socket.io-client'
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from './Games/SocketContext'
import loading from '../Img/loading.gif'
import { db, auth } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ToastContainer, toast } from 'react-toastify'


function BattleList() {
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const [opponentName, setOpponentName] = useState(null)
    const [playerName, setPlayerName] = useState('')
    const [playingAs, setPlayingAs] = useState(null)
    const [activeBtn, setActiveBtn] = useState(false)
    const [loggedUser, setLoggedUser] = useState('')
    const [wAmt, setWamt] = useState()


    socket?.on('waiting', (data) => {
        console.log('waiting for the opponent')
    })

    socket?.on('opponentNotFound', (data) => {
        setOpponentName(false)

    })
    socket?.on('opponentFound', (data) => {
        const oppoPlayer = data.opponentName
        if (activeBtn === true && oppoPlayer) {
            navigate('/TicTacToe', {
                state: {
                    opponentName: data.opponentName,
                    playingAs: data.playingAs,
                }
            })
        } else {
            navigate('/BattleList')
        }
    })

    console.log(loggedUser.Name)
    const wAmounts = wAmt

    const playOnline = () => {
        if (wAmounts >= 10) {
            setActiveBtn(true)
            socket?.emit('reqPlay', {
                playerName: loggedUser.Name,
            })
        } else {
            //navigate('/Login')
            toast.info('Insufficient balance, please add money')
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



    return (
        <>
            <div className='mainui'>
                <Header />
                    <h1>All Tournaments</h1>
                <div className='battlecard'>
                    <div className='topdetails'>
                        <img src={contact}/>
                        <span> 2 PLAYERS • 1 WINNER</span>
                        <span></span>
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

                        <div onClick={playOnline} className={activeBtn ? 'playBtn active' : 'playBtn'}>
                            {activeBtn ? <img src={loading} /> : ''}
                            <span>Play</span>
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