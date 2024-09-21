import { Request, Response, Router } from "express";
import {
  createUserSession,
  userRegistration,
} from "../controllers/auth.controller";
import {
  createCafe,
  deleteCafe,
  getAllCafe,
  getCafeById,
  getCafeByOwner,
  updateCafe,
} from "../controllers/cafe.controller";
import {
  createMenu,
  deleteMenu,
  getAllMenu,
  getMenuByCafe,
  getMenuById,
  updateMenu,
} from "../controllers/menu.controller";
import {
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "../controllers/user.controller";
import deserializeToken from "../middleware/deserializedToken";
import { requireAuthorization } from "../middleware/requireAuthorize";
import { limiter } from "../helpers/limiter.helper";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Cafetaria API is Ready to Use");
});

router.post("/auth/register", userRegistration);
router.post("/auth/login", createUserSession);

router.use(deserializeToken);

router.get("/users", requireAuthorization("owner"), limiter, getAllUser);
router.get(
  "/users/detail",
  requireAuthorization("owner"),
  limiter,
  getUserById
);
router.put("/users/update", requireAuthorization("owner"), limiter, updateUser);
router.delete(
  "/users/delete",
  requireAuthorization("owner"),
  limiter,
  deleteUser
);

router.get("/cafe", limiter, getAllCafe);
router.post("/cafe/create", requireAuthorization("owner"), limiter, createCafe);
router.get("/cafe/detail", limiter, getCafeById);
router.get(
  "/cafe/by-owner",
  requireAuthorization("owner"),
  limiter,
  getCafeByOwner
);
router.put("/cafe/update", requireAuthorization("owner"), limiter, updateCafe);
router.delete(
  "/cafe/delete",
  requireAuthorization("owner"),
  limiter,
  deleteCafe
);

router.get("/menu", limiter, getAllMenu);
router.post(
  "/menu/create",
  requireAuthorization("manager"),
  limiter,
  createMenu
);
router.get("/menu/detail", limiter, getMenuById);
router.get("/menu/by-cafe", limiter, getMenuByCafe);
router.put(
  "/menu/update",
  requireAuthorization("manager"),
  limiter,
  updateMenu
);
router.delete(
  "/menu/delete",
  requireAuthorization("manager"),
  limiter,
  deleteMenu
);

export default router;
