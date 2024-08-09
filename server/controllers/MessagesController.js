import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    if (!user1 || !user2) {
      response.json({
        messages: null,
        message: "Both user ID's are required",
        success: false,
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return response.json({
      messages: messages,
      message: "Message found",
      success: true,
    });
  } catch (error) {
    return response.json({
      messages: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.json({
        filePath: null,
        success: false,
      });
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(request.file.path, fileName);

    return response.json({
      filePath: fileName,
      success: true,
    });
  } catch (error) {
    return response.json({
      filePath: null,
      success: false,
    });
  }
};
