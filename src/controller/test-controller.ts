import { Request, Response } from "express";
export async function testController(req: Request, res: Response) {
  res.json({
    message: "ok",
    ip: req.ip,
  });
}
