import type { Request, Response } from "express";
import type { BilanController } from "./bilan.controller.ts";

class BilanRouter {
  private bilanController: BilanController;

  constructor(bilanController: BilanController) {
    this.bilanController = bilanController;
  }

  registerRoutes(app: any) {
    app.get("/bilans/history", (req: Request, res: Response) =>
      this.bilanController.getUserBilans(req, res),
    );
    app.post("/bilans", (req: Request, res: Response) =>
      this.bilanController.submitBilan(req, res),
    );
  }
}

export default BilanRouter;
