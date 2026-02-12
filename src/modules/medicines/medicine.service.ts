// import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { Medicine, Prisma } from "../../generated/prisma/client";
import { MedicineWhereInput } from "../../generated/prisma/models";
// import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";


export type GetAllMedicinesOptions = {
    search?: string | undefined;
    category?: string | undefined;
    manufacturer?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    isAvailable?: boolean | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}


const getAllMedicines = async ({
    search,
    category,
    minPrice,
    maxPrice,
    manufacturer,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: GetAllMedicinesOptions) => {
    const andConditions: Prisma.MedicineWhereInput[] = [];

    // Search by name / manufacturer / genericName
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { manufacturer: { contains: search, mode: "insensitive" } },
                { genericName: { contains: search, mode: "insensitive" } },
            ],
        });
    }

    // Filter by category
    if (category) {
        andConditions.push({ category });
    }

    // Filter by manufacturer
    if (manufacturer) {
        andConditions.push({
            manufacturer: { contains: manufacturer, mode: "insensitive" },
        });
    }

    // Filter by price range

    const priceFilter: Prisma.FloatFilter = {};

    if (typeof minPrice === "number") priceFilter.gte = minPrice;
    if (typeof maxPrice === "number") priceFilter.lte = maxPrice;

    if (Object.keys(priceFilter).length > 0) {
        andConditions.push({ price: priceFilter });
    }


    //   if (typeof minPrice === "number" || typeof maxPrice === "number") {
    //     andConditions.push({
    //       price: {
    //         gte: minPrice,
    //         lte: maxPrice,
    //       },
    //     });
    //   }

    // Always filter available medicines
    if (isAvailable !== undefined) {
        andConditions.push({ isAvailable: isAvailable === true });
    }

    // Fetch data
    const allMedicine = await prisma.medicine.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions,
        },
        orderBy: [
            { isAvailable: 'desc' }, // 'desc' দিলে true (1) আগে আসবে, false (0) পরে যাবে
            { [sortBy]: sortOrder },]
    });

    // Count total for pagination
    const total = await prisma.medicine.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allMedicine,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const createMedicine = async (data: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>, userId: string) => {
    const result = await prisma.medicine.create({
        data: {
            ...data,
            sellerId: userId
        }
    })
    return result;
}

const getMedicineById = async (id: string) => {
    const result = await prisma.medicine.findUnique({
        where: {
            id,
        },
    });

    // যদি ডাটা না পাওয়া যায় তবে একটি পরিষ্কার এরর থ্রো করা ভালো
    if (!result) {
        throw new Error("Medicine not found with this ID");
    }

    return result;
};
// const getMedicineById = async (medicineId: string) => {
//     return await prisma.$transaction(async (tx) => {
//         await tx.medicine.update({
//             where: {
//                 id: medicineId
//             },
//             data: {
//                 views: {
//                     increment: 1
//                 }
//             }
//         })
//         const medicineData = await tx.medicine.findUnique({
//             where: {
//                 id: medicineId
//             },
//             include: {
//                 comments: {
//                     where: {
//                         parentId: null,
//                         status: CommentStatus.APPROVED
//                     },
//                     orderBy: { createdAt: "desc" },
//                     include: {
//                         replies: {
//                             where: {
//                                 status: CommentStatus.APPROVED
//                             },
//                             orderBy: { createdAt: "asc" },
//                             include: {
//                                 replies: {
//                                     where: {
//                                         status: CommentStatus.APPROVED
//                                     },
//                                     orderBy: { createdAt: "asc" }
//                                 }
//                             }
//                         }
//                     }
//                 },
//                 _count: {
//                     select: { comments: true }
//                 }
//             }
//         })
//         return postData
//     })
// }

// const getMyMedicines = async (authorId: string) => {
//     await prisma.user.findUniqueOrThrow({
//         where: {
//             id: authorId,
//             status: "ACTIVE"
//         },
//         select: {
//             id: true
//         }
//     })


//     const result = await prisma.post.findMany({
//         where: {
//             authorId
//         },
//         orderBy: {
//             createdAt: "desc"
//         },
//         include: {
//             _count: {
//                 select: {
//                     comments: true
//                 }
//             }
//         }
//     });

//     // const total = await prisma.post.aggregate({
//     //     _count: {
//     //         id: true
//     //     },
//     //     where: {
//     //         authorId
//     //     }
//     // })

//     return result;
// }

//**
// user - sudhu nijar post update korta parbe, isFeatured update korta parbe na
// admin - sobar post update korta parbe.
// */

// const updateMedicine = async (medicineId: string, data: Partial<Medicine>, authorId: string, isAdmin: boolean) => {
//     const medicineData = await prisma.medicine.findUniqueOrThrow({
//         where: {
//             id: medicineId
//         },
//         select: {
//             id: true,
//             sellerId: true
//         }
//     })

//     if (!isAdmin && (postData.authorId !== authorId)) {
//         throw new Error("You are not the owner/creator of the post!")
//     }

//     if (!isAdmin) {
//         delete data.isFeatured
//     }

//     const result = await prisma.post.update({
//         where: {
//             id: postData.id
//         },
//         data
//     })

//     return result;

// }

//** 
// 1. user - nijar created post delete korta parbe
// 2. admin - sobar post delete korta parbe
// */

// const deleteMedicine = async (medicineId: string, authorId: string, isAdmin: boolean) => {
//     const medicineData = await prisma.medicine.findUniqueOrThrow({
//         where: {
//             id: medicineId
//         },
//         select: {
//             id: true,
//             authorId: true
//         }
//     })

//     if (!isAdmin && (postData.authorId !== authorId)) {
//         throw new Error("You are not the owner/creator of the post!")
//     }

//     return await prisma.post.delete({
//         where: {
//             id: postId
//         }
//     })
// }



// const getStats = async () => {
//     return await prisma.$transaction(async (tx) => {
//         const [totalPosts, publlishedPosts, draftPosts, archivedPosts, totalComments, approvedComment, totalUsers, adminCount, userCount, totalViews] =
//             await Promise.all([
//                 await tx.post.count(),
//                 await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
//                 await tx.post.count({ where: { status: PostStatus.DRAFT } }),
//                 await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
//                 await tx.comment.count(),
//                 await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
//                 await tx.user.count(),
//                 await tx.user.count({ where: { role: "ADMIN" } }),
//                 await tx.user.count({ where: { role: "USER" } }),
//                 await tx.post.aggregate({
//                     _sum: { views: true }
//                 })
//             ])

//         return {
//             totalPosts,
//             publlishedPosts,
//             draftPosts,
//             archivedPosts,
//             totalComments,
//             approvedComment,
//             totalUsers,
//             adminCount,
//             userCount,
//             totalViews: totalViews._sum.views
//         }
//     })

// }

export const MedicineService = {
    createMedicine,
    getAllMedicines,
    getMedicineById,
    // getAllPost,
    // getPostById,
    // getMyPosts,
    // updatePost,
    // deletePost,
    // getStats
}