import { Router } from "express";
const router = Router();

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { layout: false });
});

export default router;