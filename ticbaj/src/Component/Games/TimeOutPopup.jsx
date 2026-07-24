import React from 'react'
import './TicTacToe.css'
import { useNavigate } from 'react-router-dom'
import { socket } from './Socket'

const TimeOutPopup = ({ timeOutPopup, wonmsg, oppoDisconnected }) => {
    const navigate = useNavigate()

    const HomeBtn = () => {
        socket?.disconnect()
        navigate('/')
        window.location.reload();
    }

    return (
        <>
            <div className={timeOutPopup ? 'blackbg' : 'display-none'}></div>
            <div className={timeOutPopup ? 'popup' : 'display-none'}>


                {oppoDisconnected ? (
                    <h1>{oppoDisconnected ? oppoDisconnected : ""}</h1>
                ) : (
                    <h1>{wonmsg ? wonmsg : "You lost the game"}</h1>
                )}

                <button onClick={HomeBtn}>HOME</button>


            </div>
        </>
    )
}

export default TimeOutPopup