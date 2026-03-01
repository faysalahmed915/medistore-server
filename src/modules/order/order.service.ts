import { prisma } from "../../lib/prisma";

const createOrder = async (userId: string, payload: any) => {
  const { items, shippingAddress, paymentMethod } = payload;

  // ট্রানজ্যাকশন শুরু
  return await prisma.$transaction(async (tx) => {
    // ১. অর্ডার তৈরি করা (প্রাথমিক টোটাল ০)
    const order = await tx.order.create({
      data: {
        userId,
        shippingAddress,
        paymentMethod,
        totalAmount: 0, 
      },
    });

    let calculatedTotal = 0;

    // ২. অর্ডার আইটেমগুলো তৈরি করা এবং স্টক চেক/আপডেট করা
    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine || medicine.stock < 1) {
        throw new Error(`Medicine ${medicine?.name || 'Unknown'} is out of stock!`);
      }

      if (medicine.stock < item.quantity) {
        throw new Error(`Medicine ${medicine?.name || 'Unknown'} stock is insufficient! we only have ${medicine.stock} much left. Please reduce quantity.`);
      }

      // অর্ডার আইটেম ইনসার্ট
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: medicine.price,
        },
      });

      // স্টক কমিয়ে দেওয়া
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });

      calculatedTotal += medicine.price * item.quantity;
    }

    // ৩. ফাইনাল টোটাল অ্যামাউন্ট আপডেট করা
    const finalOrder = await tx.order.update({
      where: { id: order.id },
      data: { totalAmount: calculatedTotal },
      include: { items: { include: { medicine: true } } },
    });

    // ৪. কার্ট থেকে এই আইটেমগুলো রিমুভ করা (যদি থাকে)
    const userCart = await tx.cart.findUnique({ where: { userId } });
    if (userCart) {
      await tx.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
          medicineId: { in: items.map((i: any) => i.medicineId) },
        },
      });
    }

    return finalOrder;
  });
};

const getMyOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { medicine: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const OrderService = {
  createOrder,
  getMyOrders,
};