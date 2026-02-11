// import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { Medicine } from "../../generated/prisma/client";
import { MedicineWhereInput } from "../../generated/prisma/models";
// import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createMedicine = async (data: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt' | 'sellerId'>, userId: string) => {
    const result = await prisma.medicine.create({
        data: {
            ...data,
            sellerId: userId
        }
    })
    return result;
}

const getAllMedicines = async () => {
    const allMedicines = await prisma.medicine.findMany();
    return allMedicines;
};


// const getAllMedicines = async ({
//     search,
//     tags,
//     isAvailable,
//     // status,
//     sellerId,
//     page,
//     limit,
//     skip,
//     sortBy,
//     sortOrder
// }: {
//     search: string | undefined,
//     tags: string[] | [],
//     isAvailable: boolean | undefined,
//     // status: PostStatus | undefined,
//     sellerId: string | undefined,
//     page: number,
//     limit: number,
//     skip: number,
//     sortBy: string,
//     sortOrder: string
// }) => {
//     const andConditions: MedicineWhereInput[] = []

//     // if (search) {
//     //     andConditions.push({
//     //         OR: [
//     //             {
//     //                 title: {
//     //                     contains: search,
//     //                     mode: "insensitive"
//     //                 }
//     //             },
//     //             {
//     //                 content: {
//     //                     contains: search,
//     //                     mode: "insensitive"
//     //                 }
//     //             },
//     //             {
//     //                 tags: {
//     //                     has: search
//     //                 }
//     //             }
//     //         ]
//     //     })
//     // }

//     // if (tags.length > 0) {
//     //     andConditions.push({
//     //         tags: {
//     //             hasEvery: tags as string[]
//     //         }
//     //     })
//     // }

//     if (typeof isAvailable === 'boolean') {
//         andConditions.push({
//             isAvailable
//         })
//     }

//     // if (status) {
//     //     andConditions.push({
//     //         status
//     //     })
//     // }

//     if (sellerId) {
//         andConditions.push({
//             sellerId
//         })
//     }

//     const allMedicine = await prisma.medicine.findMany({
//         take: limit,
//         skip,
//         where: {
//             AND: andConditions
//         },
//         orderBy: {
//             [sortBy]: sortOrder
//         },
//         include: {
//             _count: {
//                 select: { comments: true }
//             }
//         }
//     });

//     const total = await prisma.medicine.count({
//         where: {
//             AND: andConditions
//         }
//     })
//     return {
//         data: allMedicine,
//         pagination: {
//             total,
//             page,
//             limit,
//             totalPages: Math.ceil(total / limit)
//         }
//     };
// }

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
    // getAllPost,
    // getPostById,
    // getMyPosts,
    // updatePost,
    // deletePost,
    // getStats
}