import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { setSocketServer } from "./config/socket.js";

async function startServer() {
  await connectToDatabase();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [env.clientUrl, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next();
    }

    try {
      const user = jwt.verify(token, env.jwtSecret);
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid socket token."));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.sub) {
      socket.join(`user:${socket.user.sub}`);
    }
  });

  setSocketServer(io);

  server.listen(env.port, () => {
    console.log(`API server listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
