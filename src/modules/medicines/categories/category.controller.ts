import { NextFunction, Request, Response } from "express";

import { CategoryService } from "./category.service";

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await CategoryService.createCategory(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        next(e)
    }
}


export const CategoryController = {
    createCategory,
    // getAllPost,
    // getPostById,
    // getMyPosts,
    // updatePost,
    // deletePost,
    // getStats
}