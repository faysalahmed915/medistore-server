import express from "express";
import { CartController } from "./cart.controller";
import { UserRole } from "../../constants/role";
import auth from "../../middlewares/auth";
 

// পরে auth middleware যোগ করতে হবে
 
const router = express.Router();

router.post("/customer/cart", 
    auth(UserRole.CUSTOMER, UserRole.USER, UserRole.SELLER, UserRole.ADMIN), 
     CartController.addToCart);
router.get("/cart", 
    auth(), 
    CartController.getMyCart);

export const CartRouter = router;