import { prisma } from "../../lib/prisma";

const createOrder = async (userId: string, payload: any) => {
  const { items, shippingAddress, paymentMethod } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. অর্ডার তৈরি (আপনার স্কিমা অনুযায়ী orderStatus ফিল্ড ব্যবহার করুন)
    const order = await tx.order.create({
      data: {
        userId,
        shippingAddress,
        paymentMethod: paymentMethod || "COD",
        orderStatus: "PLACED",
        totalAmount: 0,
      },
    });

    let calculatedTotal = 0;

    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine) throw new Error("Medicine not found");
      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }

      // ২. অর্ডার আইটেম তৈরি
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: medicine.price,
        },
      });

      // ৩. স্টক আপডেট
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });

      calculatedTotal += medicine.price * item.quantity;
    }

    // ৪. ফাইনাল অ্যামাউন্ট আপডেট
    return await tx.order.update({
      where: { id: order.id },
      data: { totalAmount: calculatedTotal },
      include: { items: { include: { medicine: true } } },
    });
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