import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

//token generate
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

//signup user
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email && !password) {
      return response.json({
        message: "Email and Password is required",
        success: false,
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return response.json({
        message: "Email already exist",
        success: false,
      });
    }

    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return response.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
      },
      message: "Signup Successfully",
      success: true,
    });
  } catch (error) {
    return response.json({ message: "Internal Server Error", success: false });
  }
};

//user login
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email && !password) {
      return response.json({
        message: "Email and Password is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.json({
        message: "User with given email not found",
        success: false,
      });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return response.json({
        message: "Password is incorrect",
        success: false,
      });
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    response.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
      },
      message: "Login Successfully",
      success: true,
    });
  } catch (error) {
    return response.json({ message: "Internal Server Error", success: false });
  }
};

//user login
export const userInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.json({
        user: null,
        message: "User with given id not found",
        success: false,
      });
    }

    response.json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
      message: "data found",
      success: true,
    });
  } catch (error) {
    return response.json({
      user: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName || !color) {
      return response.json({
        user: null,
        message: "Firstname lastname and color is required",
        success: false,
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    response.json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    return response.json({
      user: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.json({
        image: null,
        message: "File is required",
        success: false,
      });
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );

    response.json({
      image: updatedUser.image,
      message: "Image updated successfully",
      success: true,
    });
  } catch (error) {
    return response.json({
      image: null,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    if (!user) {
      return response.json({
        message: "User not found",
        success: false,
      });
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    response.json({
      message: "Profile image removed successfully",
      success: true,
    });
  } catch (error) {
    return response.json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    response.json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    return response.json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
