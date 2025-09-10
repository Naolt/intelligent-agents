import { getDatabase } from "../config/database";
import crypto from "node:crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiResponse } from "@/utils/ApiReponse";
import { ObjectId } from "mongodb";

async function getTokenDetails(token: string) {
  const db = getDatabase();
  const tokensCollection = db.collection("access_tokens");
  try {
    const result = await tokensCollection.findOne({
      token,
      deleted: 0,
    });
    return result; // Returns true if the token exists, false otherwise
  } catch (error) {
    console.error("Error checking token in MongoDB:", error);
    throw error;
  }
}

async function getUserDetails(userId: string) {
  const db = getDatabase();
  const usersCollection = db.collection("users");
  const result = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 0 } }
  );

  return {
    ...result,
    _id: result?._id.toString(),
  };
}

const protectRoute: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header("token");
  if (!token || token == undefined) {
    ApiResponse.unauthorized(res, "Unauthorized - Token missing").send(res);
    return;
  }
  try {
    const tokenDetails = await getTokenDetails(token as string);

    if (tokenDetails?.userId) {
      const userDetails = await getUserDetails(tokenDetails.userId);
      if (userDetails) {
        req.user = userDetails;
        next();
      } else {
        ApiResponse.unauthorized(res, "Unauthorized - User not found").send(
          res
        );
      }
    } else {
      ApiResponse.unauthorized(res, "Unauthorized - Invalid token").send(res);
    }
  } catch (error) {
    console.error("Error in protectRoute", error);
    ApiResponse.error(res, "Internal Server Error").send(res);
  }
};

// Add this middleware to verify webhook signatures
function verifyBlandWebhook(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers["x-webhook-signature"];
  const webhookSecret = process.env.BLIP_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return ApiResponse.unauthorized(
      res,
      "Missing signature or webhook secret"
    ).send(res);
  }

  const isValid =
    crypto
      .createHmac("sha256", webhookSecret as string)
      .update(JSON.stringify(req.body))
      .digest("hex") === signature;

  if (!isValid) {
    return ApiResponse.unauthorized(res, "Invalid signature").send(res);
  }

  next();
}

export { protectRoute, verifyBlandWebhook };
