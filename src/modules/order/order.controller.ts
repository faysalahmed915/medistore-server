import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    console.log("userId", userId);

    const { items, shippingAddress, paymentMethod } = req.body;

    console.log("items", items, "shippingAddress", shippingAddress, "paymentMethod", paymentMethod);

    // ভ্যালিডেশন
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for order" });
    }

    const result = await OrderService.createOrder(userId, {
      items,
      shippingAddress,
      paymentMethod,
    });

    console.log("create order :", result);

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

const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const result = await OrderService.getOrderById(id as string, userId);

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found or unauthorized" 
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
  getOrderById,
  getMyOrders,
};