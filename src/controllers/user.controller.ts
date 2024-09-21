import { Request, Response } from "express";
import db from "../db";
import { logger } from "../utils/logger";
import {
  createUserValidation,
  updateUserValidation,
} from "../validations/auth.validation";

export const getAllUser = async (req: Request, res: Response) => {
  const { role } = req.query;
  let query = "SELECT id, fullname, username, role FROM users";
  const params: any[] = [];
  if (role) {
    query += " WHERE role = ?";
    params.push(`%${role}%`);
  }
  try {
    const [result] = await db.query(query, params);
    logger.info("Success get users");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "User tidak ditemukan",
    });
  }
  try {
    const [User]: any = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    if (User.length === 0) {
      logger.info("User not found");
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User tidak ditemukan",
      });
    }
    const [result]: any = await db.query(
      "SELECT id, fullname, username, role FROM users WHERE id = ?",
      [id]
    );
    logger.info("Success get User");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      data: result[0],
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to fetch User",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { error, value } = updateUserValidation(req.body);
  const { id } = req.query;
  if (error) {
    logger.error("Error update user");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: error.message,
    });
  }
  if (!id) {
    logger.error("User id not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Sertakan id user",
    });
  }

  try {
    const [users]: any = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    if (users.length === 0) {
      logger.info("User not found");
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User tidak ditemukan",
      });
    }

    await db.query(
      "UPDATE users SET fullname = ?, username = ?, role = ? WHERE id = ?",
      [value.fullname, value.username, value.role, id]
    );
    logger.info("Success edit user's data");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil mengedit data user",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Gagal mengedit data user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    logger.error("User not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "User tidak ditemukan",
    });
  }

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    logger.info("Success delete User");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil menghapus User",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to delete User",
    });
  }
};
