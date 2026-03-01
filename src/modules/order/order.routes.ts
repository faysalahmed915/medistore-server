import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../constants/role";
// import { UserRole } from "@prisma/client";

const router = express.Router();

// কাস্টমার অর্ডার প্লেস করবে
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  OrderController.createOrder
);

// ইউজারের নিজস্ব অর্ডার লিস্ট দেখার জন্য
router.get(
  "/my-orders",
  auth(UserRole.CUSTOMER),
  OrderController.getMyOrders
);

export const OrderRouter = router;