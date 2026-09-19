import { Router, type IRouter } from "express";
import healthRouter from "./health";
import templateRouter from "./templates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(templateRouter);

export default router;
