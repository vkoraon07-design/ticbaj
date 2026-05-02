import{createContext} from 'react'
import {socket} from './Socket'

export const SocketContext = createContext(socket)