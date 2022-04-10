import { Router } from "express";

import { signIn, signUp, changeUser, deleteUser } from "./userController.js";

const router = Router();

router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.put("/update/:id", changeUser);
router.delete("/delete/:id", deleteUser);

export default router;
