import Joi from "joi";
import { UserType } from "../types/auth.type";

export const createUserValidation = (payload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    fullname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.valid("superadmin", "owner", "manager"),
  });
  return schema.validate(payload);
};

export const createSessionValidation = (payload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(payload);
};

export const refreshSessionValidation = (payload: UserType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  return schema.validate(payload);
};

export const updateUserValidation = (payload: UserType) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    fullname: Joi.string().required(),
    role: Joi.valid("superadmin", "owner", "manager"),
  });
  return schema.validate(payload);
};
