import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../constants/role";
// import { UserRole } from "@prisma/client";

const router = express.Router();

// কাস্টমার অর্ডার প্লেস করবে
router.post(
  "/orders",
  auth(UserRole.CUSTOMER),
  OrderController.createOrder
);

router.get(
  "/orders/:id", // ডাইনামিক আইডি রাউট
  auth(UserRole.CUSTOMER, UserRole.ADMIN), // কাস্টমার এবং এডমিন উভয়ই দেখতে পারবে
  OrderController.getOrderById
);


// ইউজারের নিজস্ব অর্ডার লিস্ট দেখার জন্য
router.get(
  "/orders/my-orders",
  auth(UserRole.CUSTOMER),
  OrderController.getMyOrders
);

export const OrderRouter = router;