# WebSocket Service & Routes Implementation

## File: `services/websocketService.ts`

```typescript
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer;

// Initialize WebSocket server
export const initializeWebSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Join event room
    socket.on("join_event", (eventId: string) => {
      socket.join(`event:${eventId}`);
      console.log(`Socket ${socket.id} joined event:${eventId}`);
    });
    
    // Leave event room
    socket.on("leave_event", (eventId: string) => {
      socket.leave(`event:${eventId}`);
      console.log(`Socket ${socket.id} left event:${eventId}`);
    });
    
    // Join player-specific room
    socket.on("join_player", (playerId: string) => {
      socket.join(`player:${playerId}`);
      console.log(`Socket ${socket.id} joined player:${playerId}`);
    });
    
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  return io;
};

// Broadcast score update to event room
export const broadcastScoreUpdate = async (eventId: string, data: any) => {
  if (!io) {
    console.error("WebSocket not initialized");
    return;
  }
  
  io.to(`event:${eventId}`).emit("score_updated", {
    timestamp: new Date().toISOString(),
    ...data,
  });
};

// Broadcast leaderboard update
export const broadcastLeaderboardUpdate = async (eventId: string, leaderboard: any) => {
  if (!io) {
    console.error("WebSocket not initialized");
    return;
  }
  
  io.to(`event:${eventId}`).emit("leaderboard_updated", {
    timestamp: new Date().toISOString(),
    leaderboard,
  });
};

// Broadcast player milestone (birdie, eagle, etc.)
export const broadcastMilestone = async (eventId: string, playerId: string, milestone: any) => {
  if (!io) return;
  
  io.to(`event:${eventId}`).emit("milestone_achieved", {
    timestamp: new Date().toISOString(),
    playerId,
    ...milestone,
  });
};

// Broadcast event status change
export const broadcastEventStatus = async (eventId: string, status: string) => {
  if (!io) return;
  
  io.to(`event:${eventId}`).emit("event_status_changed", {
    timestamp: new Date().toISOString(),
    eventId,
    status,
  });
};

// Send notification to specific player
export const sendPlayerNotification = async (playerId: string, notification: any) => {
  if (!io) return;
  
  io.to(`player:${playerId}`).emit("notification", {
    timestamp: new Date().toISOString(),
    ...notification,
  });
};
```

## File: `routes/gameplayRoutes.ts`

```typescript
import { Router } from "express";
import {
  startRound,
  submitHoleScore,
  updateHoleScore,
  getScorecard,
  completeRound,
} from "../controllers/gameplayController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// Start a new round
router.post("/start", startRound);

// Submit score for a hole
router.post("/score/:scorecardId", submitHoleScore);

// Update existing hole score
router.put("/scorecard/:scorecardId/hole/:holeNumber", updateHoleScore);

// Get scorecard details
router.get("/scorecard/:scorecardId", getScorecard);

// Complete round
router.post("/complete/:scorecardId", completeRound);

export default router;
```

## File: `routes/liveScoringRoutes.ts`

```typescript
import { Router } from "express";
import EventModel from "../models/Event";
import ScorecardModel from "../models/Scorecard";
import GameParticipationModel from "../models/GameParticipation";
import { getLeaderboard } from "../services/leaderboardService";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// Get live scores for an event
router.get("/events/:eventId/live", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Get all active scorecards
    const scorecards = await ScorecardModel.find({
      eventId,
      status: { $in: ["in_progress", "completed"] },
    })
    .populate("playerId", "fullName profileImage")
    .sort({ totalStrokes: 1 });
    
    const liveScores = scorecards.map(card => ({
      playerId: card.playerId._id,
      playerName: card.playerId.fullName,
      profileImage: card.playerId.profileImage,
      totalStrokes: card.totalStrokes,
      holesCompleted: card.holesCompleted,
      currentHole: card.holesCompleted + 1,
      status: card.status,
      lastUpdate: card.holes[card.holes.length - 1]?.timestamp || card.startTime,
    }));
    
    return res.status(200).json({
      eventId,
      eventName: event.eventName,
      gameFormat: event.gameFormat,
      liveScores,
    });
    
  } catch (error) {
    console.error("Error fetching live scores:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get leaderboard for an event
router.get("/events/:eventId/leaderboard", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const leaderboard = await getLeaderboard(eventId);
    
    return res.status(200).json({ leaderboard });
    
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get player status in event
router.get("/events/:eventId/player/:playerId/status", async (req, res) => {
  try {
    const { eventId, playerId } = req.params;
    
    const participation = await GameParticipationModel.findOne({ eventId, playerId });
    const scorecard = await ScorecardModel.findOne({ eventId, playerId });
    
    if (!participation) {
      return res.status(404).json({ message: "Player not registered for this event" });
    }
    
    return res.status(200).json({
      participation,
      scorecard,
      currentHole: scorecard?.holesCompleted ? scorecard.holesCompleted + 1 : 1,
      lastHoleScore: scorecard?.holes[scorecard.holes.length - 1] || null,
    });
    
  } catch (error) {
    console.error("Error fetching player status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
```

## File: `server.ts` - WebSocket Integration

```typescript
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { initializeWebSocket } from "./services/websocketService";
import gameplayRoutes from "./routes/gameplayRoutes";
import liveScoringRoutes from "./routes/liveScoringRoutes";
import eventRoutes from "./routes/eventRoutes";

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/gameplay", gameplayRoutes);
app.use("/api/live", liveScoringRoutes);
app.use("/api/events", eventRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## WebSocket Events Reference

### Client-Side Events (Emitted by client)
- `join_event` - Join event room to receive updates
- `leave_event` - Leave event room
- `join_player` - Join player-specific room

### Server-Side Events (Emitted by server)
- `score_updated` - When a player submits a score
- `leaderboard_updated` - When leaderboard positions change
- `milestone_achieved` - When player gets birdie, eagle, etc.
- `event_status_changed` - When event starts/completes
- `round_completed` - When player finishes round
- `notification` - Player-specific notifications
