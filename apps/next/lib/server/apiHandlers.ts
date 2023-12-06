import { ApiError } from "models";
import { NextApiHandler } from "next";
import { ZodError, ZodIssue } from "zod";

type Method = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE";

interface ErrorResponse {
  message: string;
  issues?: ZodIssue[];
}

export function createApiHandler<T>(
  handler: NextApiHandler<T>
): NextApiHandler<T | ErrorResponse> {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: e.message, issues: e.issues });
      }

      const message = e instanceof Error ? e.message : "an error occured";
      const status = e instanceof ApiError ? e.status : 500;
      console.error(e);
      res.status(status).json({ message });
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
