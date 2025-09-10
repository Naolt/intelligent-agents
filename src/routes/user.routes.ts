import { Router, Request, Response } from "express";
import { validate } from "../middlewares/validationMiddleware";
import { createUserSchema, loginSchema } from "../schemas/user.schema";
import { ApiResponse } from "@/utils/ApiReponse";

const router = Router();

router.post(
  "/register",
  validate(createUserSchema),
  async (req: Request, res: Response): Promise<void> => {
    ApiResponse.created(res, "User registered successfully", {
      id: "123",
      email: req.body.email,
    });
  }
);

router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    ApiResponse.success(res, "Login successful", {
      token: "jwt-token",
      user: { id: "123", email: req.body.email },
    });
  }
);

router.get(
  "/profile/:id",
  async (req: Request, res: Response): Promise<void> => {
    const user = null;
    if (!user) {
      ApiResponse.notFound(res, "User not found");
      return;
    }

    new ApiResponse(200, "Profile retrieved successfully", {
      id: "123",
      name: "John Doe",
    }).send(res);
  }
);

export default { path: "/users", router };
