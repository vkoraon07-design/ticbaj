const { createServer } = require("http")
const { Server } = require("socket.io")

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
})

const allUsers = {}
const allRooms = []


io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  allUsers[socket.id] = {
    socket: socket,
    online: true
  }
  socket.on('reqPlay', (data) => {
    const currentUser = allUsers[socket.id]
    currentUser.playerName = data.playerName

    let opponentPlayer

    allRooms.push({
      player1: opponentPlayer,
      player2: currentUser
    })

    for (const key in allUsers) {
      const user = allUsers[key]
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user
        break

      }
    }

    if (opponentPlayer) {
      currentUser.socket.emit('opponentFound', {
        opponentName: opponentPlayer.playerName,
        playingAs: 'O',
      })
      opponentPlayer.socket.emit('opponentFound', {
        opponentName: currentUser.playerName,
        playingAs: 'X',
      })
      currentUser.socket.on('ClientMove', (data) => {
        opponentPlayer.socket.emit('ServerMove', {
          ...data
        })
      })
      opponentPlayer.socket.on('ClientMove', (data) => {
        currentUser.socket.emit('ServerMove', {
          ...data
        })
      })
    } else {
      currentUser.socket.emit('opponentNotFound')

    }
  })

  socket.on('disconnect', () => {
    const currentUser = allUsers[socket.id]
    currentUser.online = false
    currentUser.playing = false

    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index]

      if (player1.socket?.id === socket.id) {
        player2.socket.emit('opponentLeftMatch')

      }
      if (player2.socket?.id === socket.id) {
        player1.socket.emit('opponentLeftMatch')

      }
    }
  })


});



httpServer.listen(3000)