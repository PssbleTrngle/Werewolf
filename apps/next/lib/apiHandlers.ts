import { NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";

type Method = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE";

interface ErrorResponse {
  message: string;
}

export function createApiHandler<T>(
  handler: NextApiHandler<T>
): NextApiHandler<T | ErrorResponse> {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (e) {
      if (e instanceof ApiError) {
        res.status(e.statusCode).json({ message: e.message });
      }
    }
  };
}

export function methods(
  handlers: Partial<Record<Method, NextApiHandler>>
): NextApiHandler {
  return (req, res) => {
    const method = req.method?.toUpperCase() ?? "GET";
    const handler = handlers[method as Method];

    if (handler) return handler(req, res);

    return res.status(405).json({
      message: `Method ${method} not allowed`,
      allowedMethods: Object.keys(handlers),
    });
  };
}
