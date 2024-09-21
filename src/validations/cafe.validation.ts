import Joi from "joi";
import { CafeType } from "../types/cafe.type";

export const createCafeValidation = (payload: CafeType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone_number: Joi.string()
      .pattern(/^\+62[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Contact person must be a valid number starting with +62",
      }),
  });
  return schema.validate(payload);
};
