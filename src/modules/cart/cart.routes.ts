import express from "express";
import { CartController } from "./cart.controller";
// import { auth } from "@/middlewares/auth"; 
 

// পরে auth middleware যোগ করতে হবে

const router = express.Router();

router.post("/customer/cart", 
    // auth(),
     CartController.addToCart);
router.get("/cart", 
    // auth(), 
    CartController.getMyCart);

export const CartRouter = router;