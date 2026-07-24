import React from 'react'
import './TicTacToe.css'
import crawn from '../../Img/crawn.png'
import { useNavigate } from 'react-router-dom'
import { socket } from './Socket'

function PopupCard({ finishedState }) {
    const navigate = useNavigate()

    const HomeBtn = () => {
        socket?.disconnect()
        navigate('/')
        window.location.reload()
    }

    return (
        <>
            <div className={finishedState ? 'blackbg' : 'display-none'}></div>
            <div className={finishedState ? 'popup' : 'display-none'}>

                <div className={finishedState !== 'Draw' ? 'winner' : 'display-none'}>
                    {finishedState && finishedState !== 'Draw' && (
                        <h1>{finishedState} won the match</h1>
                    )}
                </div>

                {finishedState && finishedState === 'Draw' && (
                    <h1>Draw!!</h1>
                )}
                <button onClick={HomeBtn}>HOME</button>
            </div>


        </>
    )
}

export default PopupCard