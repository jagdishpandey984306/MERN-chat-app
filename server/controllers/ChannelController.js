import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      return response.json({
        channel: null,
        message: "Admin user not found",
        success: false,
      });
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      response.json({
        channel: null,
        message: "Some members are not valid users.",
        success: false,
      });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    response.json({
      channel: newChannel,
      message: "Channel Created successfully",
      success: true,
    });
  } catch (error) {
    return response.json({
      channel: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getUserChannels = async (request, response, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    response.json({
      channels: channels,
      message: "Channel fetched",
      success: true,
    });
  } catch (error) {
    return response.json({
      channel: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getChannelMessages = async (request, response, next) => {
  try {
    const { channelId } = request.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return response.json({
        messages: null,
        message: "Channel not found.",
        success: false,
      });
    }

    const messages = channel.messages;
    response.json({
      messages: messages,
      message: "Channel fetched",
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
