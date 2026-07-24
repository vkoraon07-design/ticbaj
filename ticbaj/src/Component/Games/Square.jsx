import React, { useContext, useState } from 'react'
import { SocketContext } from './SocketContext'
import './TicTacToe.css'
import Sound from './Sound/click.mp3'


function Square({ currentElement, playingAs, id, setGameState, currentPlayer, setCurrentPlayer, finishedState, setIsActive, finishedArrayState, gameState}) {
    const [icon, setIcon] = useState(null)
    const socket = useContext(SocketContext)
    const clickSound = new Audio(Sound)

    const clickOnSquare = () => {
        if (playingAs !== currentPlayer) return
        if (finishedState) return

        const rowIndex = Math.floor(id / 3)
        const colIndex = id % 3

        if (gameState[rowIndex][colIndex] === 'O' || gameState[rowIndex][colIndex] === 'X') {
            return // ❌ already filled
           
        }


        if (!icon) {
            if (currentPlayer === 'O') {
                setIcon('O')
                clickSound.play()
            } else {
                setIcon('X')
                clickSound.play()
            }
            const myCurrentPlayer = currentPlayer

            socket.emit('ClientMove', {
                state: {
                    id,
                    sign: myCurrentPlayer
                }
            })
            setCurrentPlayer(currentPlayer === 'O' ? 'X' : 'O')


            setGameState(prevState => {
                let newState = [...prevState]
                const rowIndex = Math.floor(id / 3)
                const colIndex = id % 3;
                newState[rowIndex][colIndex] = myCurrentPlayer
                return newState
            })
        }
    }

    return (
        <>
            <div onClick={clickOnSquare} className={`square ${finishedState ? 'not-allowed' : ''} ${currentPlayer !== playingAs ? 'not-allowed' : ''} ${finishedArrayState.includes(id) ? finishedState + '-won' : ''}`}>
                <span>{currentElement === 'O' ? 'O' : currentElement === 'X' ? 'X' : icon}</span>
            </div>

        </>
    )
}

export default Square