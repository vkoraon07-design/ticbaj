const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://ticbaj.web.app",
  },

  // Detect dead/offline sockets
  pingInterval: 5000,
  pingTimeout: 5000,
});

const PORT = process.env.PORT || 3000;

let queue = [];
let roomCount = 0;

// socket.id -> roomId
const users = {};

// roomId -> players
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ==========================================
  // REQUEST TO PLAY
  // ==========================================
  socket.on("reqPlay", (data) => {
    const {
      playerName,
      BtnNum,
      Prize,
      Active,
      uid,
    } = data;

    if (!uid) return;

    // ------------------------------------------
    // Remove this socket from old queue entry
    // ------------------------------------------
    queue = queue.filter((p) => p.id !== socket.id);

    // ------------------------------------------
    // Remove old queue entry of same UID
    // ------------------------------------------
    queue = queue.filter((p) => p.uid !== uid);

    // ------------------------------------------
    // Check if this UID is already playing
    // ------------------------------------------
    const alreadyPlaying = Object.values(users).some(
      (roomId) => {
        const room = rooms[roomId];

        if (!room) return false;

        return room.some((player) => player.uid === uid);
      }
    );

    if (alreadyPlaying) {
      console.log("User already playing:", uid);
      return;
    }

    // ------------------------------------------
    // Find opponent BEFORE adding current player
    // ------------------------------------------
    const opponentIndex = queue.findIndex(
      (p) =>
        p.id !== socket.id &&
        p.BtnNum === BtnNum
    );

    // ==========================================
    // NO OPPONENT -> ADD TO QUEUE
    // ==========================================
    if (opponentIndex === -1) {
      queue.push({
        id: socket.id,
        name: playerName,
        uid: uid,
        socket: socket,
        BtnNum: BtnNum,
        Active: Active,
      });

      console.log(
        "Waiting:",
        playerName,
        "Button:",
        BtnNum
      );

      // ----------------------------------------
      // Button count
      // ----------------------------------------
      const count = queue.filter(
        (p) => p.BtnNum === BtnNum
      ).length;

      io.emit("buttonSocketCount", {
        socketCount: count,
        BtnNum: BtnNum,
      });

      // ----------------------------------------
      // Tell other users this button is active
      // ----------------------------------------
      socket.broadcast.emit("btnIsActive", {
        Active: Active,
        BtnNum: BtnNum,
      });

      return;
    }

    // ==========================================
    // OPPONENT FOUND
    // ==========================================

    const player1 = queue[opponentIndex];

    const player2 = {
      id: socket.id,
      name: playerName,
      uid: uid,
      socket: socket,
      BtnNum: BtnNum,
      Active: Active,
    };

    // ------------------------------------------
    // Remove opponent from queue
    // ------------------------------------------
    queue.splice(opponentIndex, 1);

    // ------------------------------------------
    // Create room
    // ------------------------------------------
    const roomId = `room-${roomCount++}`;

    player1.socket.join(roomId);
    player2.socket.join(roomId);

    // ------------------------------------------
    // Save room
    // ------------------------------------------
    rooms[roomId] = [
      {
        id: player1.id,
        uid: player1.uid,
        name: player1.name,
        socket: player1.socket,
        BtnNum: player1.BtnNum,
      },
      {
        id: player2.id,
        uid: player2.uid,
        name: player2.name,
        socket: player2.socket,
        BtnNum: player2.BtnNum,
      },
    ];

    users[player1.id] = roomId;
    users[player2.id] = roomId;

    console.log(
      "ROOM CREATED:",
      roomId
    );

    console.log(
      player1.name,
      "vs",
      player2.name
    );

    // ------------------------------------------
    // Match found
    // ------------------------------------------

    player1.socket.emit("match-found", {
      opponentName: player2.name,
      playingAs: "O",
      BtnNum: BtnNum,
      Prize: Prize,
    });

    player2.socket.emit("match-found", {
      opponentName: player1.name,
      playingAs: "X",
      BtnNum: BtnNum,
      Prize: Prize,
    });

    // ==========================================
    // GAME EVENTS
    // ==========================================

    player1.socket.on("ClientMove", (data) => {
      player2.socket.emit("ServerMove", {
        ...data,
      });
    });

    player2.socket.on("ClientMove", (data) => {
      player1.socket.emit("ServerMove", {
        ...data,
      });
    });

    player1.socket.on("timeout", (data) => {
      player2.socket.emit("timeoutinfo", {
        Wonalert: data.Wonalert,
      });
    });

    player2.socket.on("timeout", (data) => {
      player1.socket.emit("timeoutinfo", {
        Wonalert: data.Wonalert,
      });
    });
  });

  // ==========================================
  // LEAVE QUEUE
  // ==========================================

  socket.on("leaveQueue", () => {
    console.log(
      "Leave queue:",
      socket.id
    );

    removeFromQueue(socket.id);

    sendButtonCounts();
  });

  // ==========================================
  // GAME ENDED
  // ==========================================

  socket.on("gameEnded", (data) => {
    console.log(
      "Game ended:",
      socket.id
    );

    removeFromQueue(socket.id);

    const roomId = users[socket.id];

    if (roomId) {
      socket.to(roomId).emit(
        "opponentDisconnected",
        {
          gameEnd: data.gameEnd,
        }
      );

      removePlayerFromRoom(
        socket.id,
        roomId
      );
    }
  });

  // ==========================================
  // DISCONNECT
  // ==========================================

  socket.on("disconnect", (reason) => {
    console.log(
      "Disconnected:",
      socket.id,
      reason
    );

    // ------------------------------------------
    // VERY IMPORTANT
    // Remove socket from waiting queue
    // ------------------------------------------

    const wasInQueue = queue.some(
      (p) => p.id === socket.id
    );

    removeFromQueue(socket.id);

    if (wasInQueue) {
      console.log(
        "Removed from waiting queue:",
        socket.id
      );

      sendButtonCounts();
    }

    // ------------------------------------------
    // Check if player was in a game
    // ------------------------------------------

    const roomId = users[socket.id];

    if (roomId) {
      console.log(
        "Player left room:",
        roomId
      );

      socket.to(roomId).emit(
        "opponentDisconnected",
        {
          winner: "Opponent left the match",
        }
      );

      removePlayerFromRoom(
        socket.id,
        roomId
      );
    }
  });
});

// ==============================================
// REMOVE PLAYER FROM QUEUE
// ==============================================

function removeFromQueue(socketId) {
  const oldLength = queue.length;

  queue = queue.filter(
    (player) => player.id !== socketId
  );

  if (queue.length !== oldLength) {
    console.log(
      "Queue cleaned:",
      socketId
    );
  }
}

// ==============================================
// REMOVE PLAYER FROM ROOM
// ==============================================

function removePlayerFromRoom(
  socketId,
  roomId
) {
  delete users[socketId];

  if (!rooms[roomId]) {
    return;
  }

  rooms[roomId] = rooms[roomId].filter(
    (player) => player.id !== socketId
  );

  // If room empty, delete room
  if (rooms[roomId].length === 0) {
    delete rooms[roomId];

    console.log(
      "Room deleted:",
      roomId
    );
  }
}

// ==============================================
// SEND BUTTON COUNTS
// ==============================================

function sendButtonCounts() {
  const buttonCounts = {};

  queue.forEach((player) => {
    if (!buttonCounts[player.BtnNum]) {
      buttonCounts[player.BtnNum] = 0;
    }

    buttonCounts[player.BtnNum]++;
  });

  // Send each button's current count
  Object.keys(buttonCounts).forEach(
    (BtnNum) => {
      io.emit("buttonSocketCount", {
        BtnNum: BtnNum,
        socketCount: buttonCounts[BtnNum],
      });
    }
  );
}

// ==============================================
// START SERVER
// ==============================================

httpServer.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);
