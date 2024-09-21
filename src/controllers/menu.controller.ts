import { Request, Response } from "express";
import { logger } from "../utils/logger";
import db from "../db";
import { createMenuValidation } from "../validations/menu.validation";

export const getAllMenu = async (req: Request, res: Response) => {
  const { cafe_id } = req.query;
  if (!cafe_id) {
    logger.error("Cafe id not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Sertakan id cafe",
    });
  }
  try {
    const [menu] = await db.query(
      "SELECT id, name, price, isRecommendation FROM menu WHERE cafe_id = ?",
      [cafe_id]
    );
    const [cafe]: any = await db.query("SELECT name FROM cafe WHERE id = ?", [
      cafe_id,
    ]);
    logger.info("Success get menu");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      data: {
        cafe: cafe[0].name,
        menu,
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to fetch menu",
    });
  }
};

export const getMenuById = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Menu tidak ditemukan",
    });
  }
  try {
    const [menu]: any = await db.query("SELECT * FROM menu WHERE id = ?", [id]);

    if (menu.length === 0) {
      logger.info("Menu not found");
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Menu tidak ditemukan",
      });
    }
    const [result]: any = await db.query("SELECT * FROM menu WHERE id = ?", [
      id,
    ]);
    logger.info("Success get menu");
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
      message: "Failed to fetch menu",
    });
  }
};

export const getMenuByCafe = async (req: Request, res: Response) => {
  const { cafe_id } = req.query;
  if (!cafe_id) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Cafe tidak ditemukan",
    });
  }
  try {
    const result = await db.query("SELECT * FROM menu WHERE cafe_id = ?", [
      cafe_id,
    ]);
    logger.info("Success get menu by cafe");
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
      message: "Failed to fetch menu by cafe",
    });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  const { cafe_id } = req.query;
  const { error, value } = createMenuValidation(req.body);

  if (error) {
    res.status(401).json({
      status: false,
      statusCode: 401,
      message: error.message,
    });
  }

  try {
    await db.query(
      "INSERT INTO menu (name, price, isRecommendation, cafe_id) VALUES (?, ?, ?, ?)",
      [value.name, value.price, value.isRecommendation, cafe_id]
    );
    logger.info("Success create menu");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil menambahkan menu",
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

export const updateMenu = async (req: Request, res: Response) => {
  const { error, value } = createMenuValidation(req.body);
  const { id } = req.query;
  if (!id) {
    logger.error("Menu not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Menu tidak ditemukan",
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
      "UPDATE menu SET name = ?, price = ?, isRecommendation = ? WHERE id = ?",
      [value.name, value.price, value.isRecommendation, id]
    );
    logger.info("Success update menu");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil mengedit menu",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to update menu",
    });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) {
    logger.error("Menu not found");
    return res.status(404).json({
      status: false,
      statusCode: 404,
      message: "Menu tidak ditemukan",
    });
  }

  try {
    await db.query("DELETE FROM menu WHERE id = ?", [id]);
    logger.info("Success delete menu");
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Berhasil menghapus menu",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Failed to delete menu",
    });
  }
};
