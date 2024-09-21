import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { createCafeValidation } from "../validations/cafe.validation";
import db from "../db";

export const getAllCafe = async (req: Request, res: Response) => {
  try {
    const [result] = await db.query("SELECT * FROM cafe");
    logger.info("Success get all cafe");
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
      message: "Failed to fetch cafe",
    });
  }
};

export const getCafeById = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    logger.error("Invalid or missing cafe ID");
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Cafe tidak ditemukan",
    });
  }

  try {
    const [cafe]: any = await db.query("SELECT * FROM cafe WHERE id = ?", [id]);

    if (cafe.length === 0) {
      logger.info("Cafe not found");
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Cafe tidak ditemukan",
      });
    }

    logger.info("Success get cafe by id");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      data: cafe[0],
    });
  } catch (error) {
    logger.error("Error fetching cafe:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to fetch cafe",
    });
  }
};

export const getCafeByOwner = async (req: Request, res: Response) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Cafe tidak ditemukan",
    });
  }
  try {
    const [result] = await db.query(
      `
      SELECT 
        u.fullname AS owner,
        u.username AS owner_username,
        c.name,
        c.address,
        c.phone_number
      FROM users AS u
      LEFT JOIN cafe AS c ON c.user_id = u.id
      WHERE c.user_id = ?`,
      [user_id]
    );
    logger.info("Success get cafe");
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
      message: "Failed to fetch cafe by owner",
    });
  }
};

export const createCafe = async (req: Request, res: Response) => {
  const { user_id } = req.query;
  const { error, value } = createCafeValidation(req.body);

  if (error) {
    return res.status(401).json({
      status: false,
      statusCode: 401,
      message: error.message,
    });
  }

  try {
    const [existingCafe]: any = await db.query(
      "SELECT * FROM cafe WHERE name = ?",
      [value.name]
    );
    if (existingCafe && existingCafe.length > 0) {
      logger.info("Cafe already registered");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Cafe telah terdaftar",
      });
    }

    const [existingPhoneNumber]: any = await db.query(
      "SELECT * FROM cafe WHERE phone_number = ?",
      [value.phone_number]
    );
    if (existingPhoneNumber && existingPhoneNumber.length > 0) {
      logger.info("Phone number already registered");
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Nomor HP telah digunakan",
      });
    }
    await db.query(
      "INSERT INTO cafe (name, address, phone_number, user_id) VALUES (?, ?, ?, ?)",
      [value.name, value.address, value.phone_number, user_id]
    );
    logger.info("Success create cafe");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil menambahkan cafe",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to create cafe",
    });
  }
};

export const updateCafe = async (req: Request, res: Response) => {
  const { error, value } = createCafeValidation(req.body);
  const { id } = req.query;
  if (!id) {
    logger.error("Cafe not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Cafe tidak ditemukan",
    });
  }

  if (error) {
    logger.error("Cafe not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: error.message,
    });
  }

  try {
    await db.query(
      "UPDATE cafe SET name = ?, address = ?, phone_number = ? WHERE id = ?",
      [value.name, value.address, value.phone_number, id]
    );
    logger.info("Success update cafe");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil mengedit cafe",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to update cafe",
    });
  }
};

export const deleteCafe = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    logger.error("Cafe not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Cafe tidak ditemukan",
    });
  }

  try {
    const [existingCafe]: any = await db.query(
      "SELECT * FROM cafe WHERE id = ?",
      [id]
    );

    if (existingCafe.length === 0) {
      logger.info("Cafe not found");
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Cafe tidak ditemukan",
      });
    }
    await db.query("DELETE FROM cafe WHERE id = ?", [id]);
    logger.info("Success delete cafe");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil menghapus cafe",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to delete cafe",
    });
  }
};
