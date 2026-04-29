import express from 'express';
import morgan from 'morgan';
import { BilanController } from "./modules/bilan/bilan.controller.ts";
import BilanRouter from "./modules/bilan/bilan.router.ts";
import { BilanService } from "./modules/bilan/bilan.service.ts";



const app = express();

const port = process.env.API_PORT || 3000;

app.use(morgan('dev'));

const bilanService = new BilanService();
const bilanController = new BilanController(bilanService);
const bilanRouter = new BilanRouter(bilanController);

bilanRouter.registerRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 