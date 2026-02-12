import { NextFunction, Request, Response } from "express";
// import { PostStatus } from "../../../generated/prisma/enums";
// import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { MedicineService } from "./medicine.service";

import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { Medicine } from "../../generated/prisma/browser";

const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await MedicineService.createMedicine(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        next(e)
    }
}

const getAllMedicines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;

        // Boolean check (Keeping your ternary style)
        const isAvailable = req.query.isAvailable ? req.query.isAvailable === 'true' ? true : req.query.isAvailable === 'false' ? false : undefined : undefined;

        // ১. হেল্পার থেকে ভ্যালুগুলো নেওয়া হলো (p, l, sb, so)
        const { page: p, limit: l, skip, sortBy: sb, sortOrder: so } =
            paginationSortingHelper(req.query);

        // ২. সার্ভিসে এখন সবগুলো প্যারামিটার পাঠানো হচ্ছে
        const result = await MedicineService.getAllMedicines({
            search: searchString,
            isAvailable,
            page: p,        // এখানে p পাস করতে হবে
            limit: l,       // এখানে l পাস করতে হবে
            skip: skip,
            sortBy: sb,     // এখানে sb পাস করতে হবে
            sortOrder: so   // এখানে so পাস করতে হবে
        });

        // ৩. প্রোপার রেসপন্স ফরম্যাট
        res.status(200).json({
            success: true,
            message: "Medicines fetched successfully",
            meta: result.pagination,
            data: result.data
        });
    } catch (e) {
        next(e);
    }
};

// const getAllMedicines = async (req: Request, res: Response) => {
//     try {
//         const { search } = req.query;
//          const searchString = typeof search === 'string' ? search : undefined;


//          // true or false
//         const isAvailable = req.query.isAvailable
//             ? req.query.isAvailable === 'true'
//                 ? true
//                 : req.query.isAvailable === 'false'
//                     ? false
//                     : undefined
//             : undefined


//         const { page: p, limit: l, skip, sortBy: sb, sortOrder: so } =
//             paginationSortingHelper(req.query);

//         const result = await MedicineService.getAllMedicines(
//             {search: searchString, isAvailable}
//         )

//         res.status(200).json(result);
//     } catch (e) {
//         res.status(400).json({
//             success: false,
//             message: "Failed to fetch medicines",
//             details: e instanceof Error ? e.message : e
//         });
//     }
// };



// const getAllPost = async (req: Request, res: Response) => {
//     try {
//         const { search } = req.query
//         const searchString = typeof search === 'string' ? search : undefined

//         const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


//         // true or false
//         const isFeatured = req.query.isFeatured
//             ? req.query.isFeatured === 'true'
//                 ? true
//                 : req.query.isFeatured === 'false'
//                     ? false
//                     : undefined
//             : undefined

//         const status = req.query.status as PostStatus | undefined

//         const authorId = req.query.authorId as string | undefined

//         const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

//         const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder })
//         res.status(200).json(result)
//     } catch (e) {
//         res.status(400).json({
//             error: "Post creation failed",
//             details: e
//         })
//     }
// }

// const getPostById = async (req: Request, res: Response) => {
//     try {
//         const { postId } = req.params;
//         if (!postId) {
//             throw new Error("Post Id is required!")
//         }
//         const result = await postService.getPostById(postId);
//         res.status(200).json(result)
//     } catch (e) {
//         res.status(400).json({
//             error: "Post creation failed",
//             details: e
//         })
//     }
// }

// const getMyPosts = async (req: Request, res: Response) => {
//     try {
//         const user = req.user;
//         if (!user) {
//             throw new Error("You are unauthorized!")
//         }
//         console.log("User data: ", user)
//         const result = await postService.getMyPosts(user.id);
//         res.status(200).json(result)
//     } catch (e) {
//         console.log(e)
//         res.status(400).json({
//             error: "Post fetched failed",
//             details: e
//         })
//     }
// }

// const updatePost = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = req.user;
//         if (!user) {
//             throw new Error("You are unauthorized!")
//         }

//         const { postId } = req.params;
//         const isAdmin = user.role === UserRole.ADMIN
//         const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
//         res.status(200).json(result)
//     } catch (e) {
//         next(e)
//     }
// }

// const deletePost = async (req: Request, res: Response) => {
//     try {
//         const user = req.user;
//         if (!user) {
//             throw new Error("You are unauthorized!")
//         }

//         const { postId } = req.params;
//         const isAdmin = user.role === UserRole.ADMIN
//         const result = await postService.deletePost(postId as string, user.id, isAdmin);
//         res.status(200).json(result)
//     } catch (e) {
//         const errorMessage = (e instanceof Error) ? e.message : "Post delete failed!"
//         res.status(400).json({
//             error: errorMessage,
//             details: e
//         })
//     }
// }

// const getStats = async (req: Request, res: Response) => {
//     try {
//         const result = await postService.getStats();
//         res.status(200).json(result)
//     } catch (e) {
//         const errorMessage = (e instanceof Error) ? e.message : "Stats fetched failed!"
//         res.status(400).json({
//             error: errorMessage,
//             details: e
//         })
//     }
// }

export const MedicineController = {
    createMedicine,
    getAllMedicines,
    // getAllPost,
    // getPostById,
    // getMyPosts,
    // updatePost,
    // deletePost,
    // getStats
}