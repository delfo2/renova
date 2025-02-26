import express, { Express } from "express";
import messageRoutes from "./messageRoutes";
import conversationRoutes from "./conversationRoutes";

export const router: Express = express();

router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);
