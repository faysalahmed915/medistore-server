import { Request, Response, NextFunction } from "express";
import { CartService } from "./cart.service";

// const addToCart = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = (req as any).user.id || "9LzHE85Mwkw2xCPsqvYVbZgmcwTJs2Y4"; 

//     console.log(userId);
//     const { medicineId, quantity } = req.body;

//     console.log(req.body);

//     const result = await CartService.addToCart(userId, medicineId, quantity || 1);

//     res.status(200).json({
//       success: true,
//       message: "Item added to cart",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // পোস্টম্যান টেস্টের জন্য যদি ইউজার না থাকে তবে ম্যানুয়ালি আইডি দিন
        const user = (req as any).user;
        const userId = user?.id || "bW85sBNwNlkRtWqfMg023Cc4pGUpwctP";

        console.log("UserID found:", userId);

        const { medicineId, quantity } = req.body;

        if (!medicineId) {
            return res.status(400).json({ success: false, message: "MedicineId is missing" });
        }

        const result = await CartService.addToCart(userId, medicineId, Number(quantity) || 1);

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: result,
        });
    } catch (error: any) {
        console.error("DEBUG CART ERROR:", error); // এটি আপনার টার্মিনালে এরর দেখাবে
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId = (req as any).user.id || "bW85sBNwNlkRtWqfMg023Cc4pGUpwctP"; 
        const userId = "bW85sBNwNlkRtWqfMg023Cc4pGUpwctP";
        console.log("Fetching cart for User:", userId);

        const result = await CartService.getMyCart(userId);

        if (!result) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                data: { items: [] }
            });
        };

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        // next(error);
        console.error("GET_CART_ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const deleteFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { itemId } = req.params;
        const result = await CartService.deleteFromCart(userId, itemId as string);

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            data: result,
        });



    } catch (e) {
        next(e);
    }
};

export const CartController = {
    addToCart,
    getMyCart,
    deleteFromCart,
};