import { Request, Response } from "express";
import { CustomError } from "../../shared/errors.ts";
import { BilanService } from "./bilan.service";

export class BilanController {
  constructor(private bilanService: BilanService) {
    this.bilanService = bilanService;
  }

  async submitBilan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { answers } = req.body;

      const bilan = await this.bilanService.submitBilan({ userId, answers });
      res.status(201).json(bilan);
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ error: error.message, code: error.code });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async getUserBilans(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const bilans = await this.bilanService.getHistory(userId);
      res.status(200).json({
        bilans,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ error: error.message, code: error.code });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
