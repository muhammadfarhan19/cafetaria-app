import { NextFunction, Request, Response } from "express";

export const requireAuthorization = (
  requiredRole: "superadmin" | "owner" | "manager" | null = null
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role === null) {
      if (requiredRole === null) {
        return next();
      }
      return res.status(403).json({ message: "Access denied" });
    }

    if (requiredRole === "superadmin" && user.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can access" });
    }

    if (
      requiredRole === "owner" &&
      user.role !== "superadmin" &&
      user.role !== "owner"
    ) {
      return res
        .status(403)
        .json({ message: "Only superadmin or owner can access" });
    }

    if (
      requiredRole === "manager" &&
      (user.role === "manager" ||
        user.role === "owner" ||
        user.role === "superadmin")
    ) {
      return next();
    }

    return next();
  };
};
