export type ApiResponseStatus = "success" | "error";

export interface IApiResponse<T> {
  status: ApiResponseStatus;
  message: string;
  data?: T;
  errors?: any[];
  metadata?: {
    timestamp: string;
    path: string;
    [key: string]: any;
  };
}

import { Response } from "express";

export class ApiResponse<T> {
  private status: ApiResponseStatus;
  private statusCode: number;
  private message: string;
  private data?: T;
  private errors?: any[];
  private metadata?: Record<string, any>;

  constructor(statusCode: number, message: string, data?: T) {
    this.status = statusCode >= 400 ? "error" : "success";
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.metadata = {
      timestamp: new Date().toISOString(),
    };
  }

  public setErrors(errors: any[]): this {
    this.errors = errors;
    return this;
  }

  public setMetadata(metadata: Record<string, any>): this {
    this.metadata = {
      ...this.metadata,
      ...metadata,
    };
    return this;
  }

  public send(res: Response): Response {
    const responseBody: IApiResponse<T> = {
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    };

    if (this.data !== undefined) {
      responseBody.data = this.data;
    }

    if (this.errors) {
      responseBody.errors = this.errors;
    }

    return res.status(this.statusCode).json(responseBody);
  }

  // Static helper methods for common responses
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    return new ApiResponse(statusCode, message, data).send(res);
  }

  public static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any[]
  ): Response {
    const response = new ApiResponse(statusCode, message);
    if (errors) {
      response.setErrors(errors);
    }
    return response.send(res);
  }

  public static created<T>(res: Response, message: string, data?: T): Response {
    return new ApiResponse(201, message, data).send(res);
  }

  public static noContent(res: Response): Response {
    return new ApiResponse(204, "No Content").send(res);
  }

  public static badRequest(
    res: Response,
    message: string = "Bad Request",
    errors?: any[]
  ): Response {
    return new ApiResponse(400, message).setErrors(errors || []).send(res);
  }

  public static unauthorized(
    res: Response,
    message: string = "Unauthorized"
  ): Response {
    return new ApiResponse(401, message).send(res);
  }

  public static forbidden(
    res: Response,
    message: string = "Forbidden"
  ): Response {
    return new ApiResponse(403, message).send(res);
  }

  public static notFound(
    res: Response,
    message: string = "Not Found"
  ): Response {
    return new ApiResponse(404, message).send(res);
  }
}
