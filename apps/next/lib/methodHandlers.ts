import { NextApiHandler } from "next";

type Method = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE";

export function methods(
  handlers: Partial<Record<Method, NextApiHandler>>
): NextApiHandler {
  return (req, res) => {
    const method = req.method.toUpperCase();
    const handler = handlers[method];

    if (handler) return handler(req, res);

    return res.status(405).json({
      message: `Method ${method} not allowed`,
      allowedMethods: Object.keys(handlers),
    });
  };
}
