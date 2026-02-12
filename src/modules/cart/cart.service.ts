import { prisma } from "../../lib/prisma";

const addToCart = async (userId: string, medicineId: string, quantity: number) => {

    console.log("Service Started with:", { userId, medicineId });

    // ১. ইউজারের কার্ট আছে কিনা চেক করুন, না থাকলে তৈরি করুন
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        });
    }

    // ২. কার্টে এই ঔষধটি আগে থেকেই আছে কিনা চেক করুন
    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_medicineId: {
                cartId: cart.id,
                medicineId,
            },
        },
    });

    if (existingItem) {
        // থাকলে কোয়ান্টিটি আপডেট করুন
        return await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    }

    // ৩. না থাকলে নতুন CartItem তৈরি করুন
    return await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            medicineId,
            quantity,
        },
    });
};

const getMyCart = async (userId: string) => {
    console.log(userId);
    return await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    medicine: true, // ঔষধের নাম, দাম সব একসাথে পাওয়ার জন্য
                },
            },
        },
    });
};

const deleteFromCart = async (userId: string, itemId: string) => {
    // প্রথমে কার্ট খুঁজে বের করুন
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });
    if (!cart) {
        throw new Error("Cart not found for this user");
    }
    // তারপর কার্ট আইটেম ডিলিট করুন
    return await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            id: itemId,
        },
    });
};


export const CartService = {
    addToCart,
    getMyCart,
    deleteFromCart,
};