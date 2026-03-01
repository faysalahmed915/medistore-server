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
        const user = req.user;

        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }

        console.log("user from cart post", user);

        const userId = user?.id as string;
        // const userId = user?.id || "bW85sBNwNlkRtWqfMg023Cc4pGUpwctP";

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
        const userId = (req as any).user.id;
        // const userId = "bW85sBNwNlkRtWqfMg023Cc4pGUpwctP";
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
        console.log("userId", itemId);
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




// ৩. কোয়ান্টিটি আপডেট করার কন্ট্রোলার
const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { itemId } = req.params;
        const { quantity } = req.body; // ফ্রন্টএন্ড থেকে নতুন কোয়ান্টিটি আসবে

        const result = await CartService.updateQuantity(userId, itemId as string, Number(quantity));

        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// ৪. পুরো কার্ট খালি করার কন্ট্রোলার
const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const result = await CartService.clearCart(userId);

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const CartController = {
    addToCart,
    getMyCart,
    deleteFromCart,
    updateQuantity, // নতুন যোগ করা হয়েছে
    clearCart,      // নতুন যোগ করা হয়েছে
};