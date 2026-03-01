import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { items, shippingAddress, paymentMethod } = req.body;

    // ভ্যালিডেশন
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for order" });
    }

    const result = await OrderService.createOrder(userId, {
      items,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const result = await OrderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders,
};