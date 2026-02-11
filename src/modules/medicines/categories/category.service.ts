// import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { Category } from "../../../generated/prisma/client";
// import { MedicineWhereInput } from "../../generated/prisma/models";
// import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";

const createCategory = async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'addedById'>, userId: string) => {
    const result = await prisma.category.create({
        data: {
            ...data,
            // addedById: userId
        }
    })
    return result;
}


export const CategoryService = {
    createCategory,
    // getAllPost,
    // getPostById,
    // getMyPosts,
    // updatePost,
    // deletePost,
    // getStats
}