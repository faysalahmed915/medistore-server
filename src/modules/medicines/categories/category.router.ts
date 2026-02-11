import express, { Router } from 'express';
import { UserRole } from '../../../constants/role';
import auth from '../../../middlewares/auth';
import { CategoryController } from './category.controller';


const router = express.Router();

router.post(
    "/seller/category",
    auth(UserRole.SELLER, UserRole.ADMIN),
    CategoryController.createCategory
)


export const categoryRouter: Router = router;