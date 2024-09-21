import Joi from "joi";
import { MenuType } from "../types/menu.type";

export const createMenuValidation = (payload: MenuType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().precision(2).messages({
      "number.base": "Price must be a number",
      "number.empty": "Price cannot be empty",
      "number.precision": "Price must have up to two decimal places",
    }),
    isRecommendation: Joi.boolean().required(),
  });
  return schema.validate(payload);
};
