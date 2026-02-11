import express, { Router } from 'express';
import { UserRole } from '../../constants/role';
import auth from '../../middlewares/auth';
import { MedicineController } from './medicine.controller';

const router = express.Router();

router.get(
    "/medicines",
    MedicineController.getAllMedicines
)
// router.get(
//     "/stats",
//     auth(UserRole.ADMIN),
//     MedicineController.getStats
// )

// router.get(
//     "/my-posts",
//     auth(UserRole.USER, UserRole.ADMIN),
//     MedicineController.getMyPosts
// )

// router.get(
//     "/:postId",
//     PostController.getPostById
// )

router.post(
    "/seller/medicine",
    auth(UserRole.SELLER, UserRole.ADMIN),
    MedicineController.createMedicine
)

// router.patch(
//     "/:postId",
//     auth(UserRole.USER, UserRole.ADMIN),
//     PostController.updatePost
// )

// router.delete(
//     "/:postId",
//     auth(UserRole.USER, UserRole.ADMIN),
//     PostController.deletePost
// )

export const medicineRouter: Router = router;