import { Request, Response } from "express";
import {
  createSessionValidation,
  createUserValidation,
  refreshSessionValidation,
} from "../validations/auth.validation";
import { logger } from "../utils/logger";
import { checkPassword, hashing } from "../utils/hashing";
import db from "../db";
import { signJWT, verifyJWT } from "../utils/jwt";
import { UserModel } from "../models/user.model";

export const userRegistration = async (req: Request, res: Response) => {
  const { value, error } = createUserValidation(req.body);

  if (error) {
    logger.info(error);
    return res.status(422).json({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  const { username, fullname, password, role } = value;
  const hashedPassword = await hashing(password);

  try {
    const user = await UserModel.checkUsername(username);

    if (user) {
      logger.error("Email used");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Username telah digunakan",
      });
    }

    await UserModel.create(fullname, username, hashedPassword, role);

    logger.info("SUCCESS: user registration success");
    res.status(201).json({
      status: true,
      statusCode: 201,
      message: "Berhasil Mendaftar",
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Gagal Mendaftar",
    });
  }
};

export const createUserSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body);

  if (error) {
    logger.error(error);
    return res.status(422).json({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [value.username]
    );

    const user = rows[0];
    if (!user || !user.password) {
      logger.error("User not found or password is missing");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Pengguna tidak ditemukan, silakan mendaftar",
      });
    }

    const isValid = await checkPassword(value.password, user.password);
    if (!isValid) {
      logger.error("Email atau Sandi salah");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Email atau Kata Sandi Salah!!",
      });
    }

    const accessToken = signJWT(
      { id: user.id, role: user.role, user },
      { expiresIn: "1d" }
    );
    const refreshToken = signJWT(
      { id: user.id, role: user.role, user },
      { expiresIn: "1y" }
    );
    const id = user.id;
    const username = user.username;
    const fullname = user.fullname;
    const role = user.role;

    logger.info("Login success");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Login Berhasil",
      data: { accessToken, refreshToken },
      user: {
        id,
        fullname,
        username,
        role,
      },
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body);

  if (error) {
    logger.error(error);
    return res.status(422).json({
      status: false,
      statusCode: 422,
      message: error.details[0].message,
    });
  }

  try {
    const decoded: any = verifyJWT(value.refreshToken);

    const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [
      decoded.email,
    ]);

    const user = rows[0];

    if (!user) {
      logger.error("User not found");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Pengguna tidak ditemukan, silakan mendaftar",
      });
    }

    const id = user.id;
    const username = user.username;
    const fullname = user.fullname;
    const role = user.role;

    const accessToken = signJWT(
      { id: user.id, role: user.role, user },
      { expiresIn: "1y" }
    );

    logger.info("Refresh token successfully");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Refresh Session Successfully",
      data: { accessToken },
      user: {
        id,
        fullname,
        username,
        role,
      },
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};
