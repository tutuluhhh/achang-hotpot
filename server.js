const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// In-memory storage for all rooms
const rooms = {};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUserId = null;

  // Join a room
  socket.on('join-room', (roomId) => {
    // Leave previous room if any
    if (currentRoom) {
      socket.leave(currentRoom);
      io.to(currentRoom).emit('user-count', getOnlineCount(currentRoom));
    }

    currentRoom = roomId;

    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        orders: {},
        finalMenu: {}
      };
    }

    socket.join(roomId);

    // Send current state to the new user
    socket.emit('room-state', {
      orders: rooms[roomId].orders,
      finalMenu: rooms[roomId].finalMenu
    });

    // Notify others
    io.to(roomId).emit('user-count', getOnlineCount(roomId));
  });

  // User selects identity
  socket.on('select-user', (userId) => {
    currentUserId = userId;
  });

  // Update order
  socket.on('update-order', (data) => {
    if (!currentRoom || !data.userId) return;

    if (!rooms[currentRoom]) {
      rooms[currentRoom] = { orders: {}, finalMenu: {} };
    }
    if (!rooms[currentRoom].orders[data.userId]) {
      rooms[currentRoom].orders[data.userId] = {};
    }

    // Update the order
    if (data.quantity <= 0) {
      delete rooms[currentRoom].orders[data.userId][data.dishId];
    } else {
      rooms[currentRoom].orders[data.userId][data.dishId] = data.quantity;
    }

    // Broadcast to all users in the room
    io.to(currentRoom).emit('orders-updated', {
      userId: data.userId,
      orders: rooms[currentRoom].orders[data.userId]
    });
  });

  // Update final menu
  socket.on('update-final-menu', (data) => {
    if (!currentRoom) return;

    if (!rooms[currentRoom]) {
      rooms[currentRoom] = { orders: {}, finalMenu: {} };
    }

    if (data.quantity <= 0) {
      delete rooms[currentRoom].finalMenu[data.dishId];
    } else {
      rooms[currentRoom].finalMenu[data.dishId] = data.quantity;
    }

    // Broadcast to all users in the room
    io.to(currentRoom).emit('final-menu-updated', {
      finalMenu: rooms[currentRoom].finalMenu
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (currentRoom) {
      io.to(currentRoom).emit('user-count', getOnlineCount(currentRoom));
    }
  });
});

function getOnlineCount(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🍲 马厂老火锅在线点菜系统已启动`);
  console.log(`📱 访问: http://localhost:${PORT}`);
});
