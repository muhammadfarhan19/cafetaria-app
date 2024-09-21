// src/models/user.model.ts
import db from "../db";
import { UserType } from "../types/auth.type";

export const UserModel = {
  create: async (
    fullname: string,
    username: string,
    password: string,
    role: string | null
  ) => {
    const [result] = await db.query(
      "INSERT INTO users (fullname, username, password, role) VALUES (?, ?, ?, ?)",
      [fullname, username, password, role]
    );
    return result;
  },

  async checkUsername(username: string): Promise<boolean> {
    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows.length > 0;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  },

  getById: async (id: number) => {
    const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  update: async (
    fullname: string,
    username: string,
    password: string,
    role: string | null,
    id: number
  ) => {
    const [result] = await db.query(
      "UPDATE users SET username = ?, fullname = ?, password = ?, role = ? WHERE id = ?",
      [username, fullname, password, role, id]
    );
    return result;
  },

  delete: async (id: number) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },
};
