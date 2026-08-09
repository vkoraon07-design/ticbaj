const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: "https://ticbaj.web.app" }
});

const PORT = process.env.PORT || 3000;

let queue = [];
let roomCount = 0;
let users = {}
const rooms = {}


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("reqPlay", (data) => {
    const playerName = data.playerName
    const BtnNum = data.BtnNum
    const Prize = data.Prize
    const uid = data.uid
    const offlineFalse = data.offline

    if (!uid) return

    queue = queue.filter((p) => p.id !== socket.id && p.uid !== uid)

    if (queue.find((s) => s.id === socket.id)) return

    //check if same iser is already playing
    const alreadyPlaying = Object.values(users).some((p) => p.uid === uid)
    if (alreadyPlaying) return

    queue.push({
      id: socket.id,
      name: playerName,
      uid: uid,
      socket: socket,
      BtnNum: BtnNum
    })

    sendButtonCounts()

    const opponentIndex = queue.findIndex(
      (p) => p.id !== socket.id && p.BtnNum === BtnNum
    )

    //if someone searching, opponent knows & send alert to all socket
    if (opponentIndex === -1) {
      io.emit("btnIsActive", {
        Active: "1P Waiting........",
        BtnNum: BtnNum
      })
    } else {
      io.emit("btnIsActive", {
        Active: "",
        BtnNum: BtnNum
      })
    }



    if (opponentIndex !== -1) {

      const currentPlayerIndex = queue.findIndex(
        (p) => p.id === socket.id
      )
      sendButtonCounts()

      const player1 = queue[opponentIndex]
      const player2 = queue[currentPlayerIndex]

      // Remove both from queue
      queue = queue.filter((p) => p.id !== player1.id && p.id !== player2.id)


      const roomId = `room-${roomCount++}`;

      console.log(player1.name, player2.name)

      player1.socket.join(roomId)
      player2.socket.join(roomId)

      users[player1.id] = roomId
      users[player2.id] = roomId

      rooms[roomId] = {
        BtnNum: player1.BtnNum,
        Players: [player1.id, player2.id]
      }

      sendButtonCounts()

      player1.socket.emit("match-found", {
        opponentName: player2.name,
        playingAs: 'O',
        BtnNum: BtnNum,
        Prize: Prize,
        offline: offlineFalse
      });

      player2.socket.emit("match-found", {
        opponentName: player1.name,
        playingAs: 'X',
        BtnNum: BtnNum,
        Prize: Prize,
        offline: offlineFalse
      })


      player1.socket.on('ClientMove', (data) => {
        player2.socket.emit('ServerMove', {
          ...data
        })
      })

      player2.socket.on('ClientMove', (data) => {
        player1.socket.emit('ServerMove', {
          ...data
        })
      })

      player1.socket.on("timeout", (data) => {
        player2.socket.emit('timeoutinfo', {
          Wonalert: data.Wonalert
        })
      })

      player2.socket.on("timeout", (data) => {
        player1.socket.emit('timeoutinfo', {
          Wonalert: data.Wonalert
        })
      })

      console.log("Room created:", roomId);
    }
    sendButtonCounts()
  })


  socket.on("leaveQueue", () => {
    queue = queue.filter((p) => p.id !== socket.id)

    sendButtonCounts()
  })

  socket.on("gameEnded", (data) => {
    queue = queue.filter((p) => p.id !== socket.id)
    const roomId = users[socket.id]

    if (roomId) {
      socket.to(roomId).emit("opponentDisconnected", {
        gameEnd: data.gameEnd
      })

      delete users[socket.id]
      delete rooms[roomId];
    }
    sendButtonCounts()
  })

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    queue = queue.filter((p) => p.id !== socket.id)
    const index = queue.findIndex((p) => p.id === socket.id)

    if (index !== -1) {
      queue.splice(index, 1)
    }

    const roomId = users[socket.id]

    if (roomId) {
      socket.to(roomId).emit("opponentDisconnected", {
        winner: "Opponenet left the match"
      })

      delete users[socket.id]
      delete rooms[roomId];

    }
    sendButtonCounts()
  })

  const sendButtonCounts = () => {
    const counts = {}

    queue.forEach((p) => {
      counts[p.BtnNum] =
        (counts[p.BtnNum] || 0) + 1;
    })

    Object.values(rooms).forEach((room) => {
      room.Players.forEach(() => {
        counts[room.BtnNum] =
          (counts[room.BtnNum] || 0) + 1;
      })
    })
    io.emit("buttonCounts", counts)
  }

})

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
