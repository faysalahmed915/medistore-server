import express from "express";
import { CartController } from "./cart.controller";
import { UserRole } from "../../constants/role";
import auth from "../../middlewares/auth";


// পরে auth middleware যোগ করতে হবে

const router = express.Router();

router.post("/customer/cart",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    CartController.addToCart);

router.get("/cart",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    CartController.getMyCart);

router.delete("/cart/:itemId",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    CartController.deleteFromCart);





// ১. নির্দিষ্ট আইটেমের কোয়ান্টিটি আপডেট করার রুট
router.patch("/cart/:itemId",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    CartController.updateQuantity);

// ২. ইউজারের পুরো কার্ট ডিলিট/ক্লিয়ার করার রুট
router.delete("/cart/clear/all",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    CartController.clearCart);

export const CartRouter = router;