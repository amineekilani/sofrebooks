import express from "express";
import Loan from "../models/Loan";
import asyncHandler from "express-async-handler";
    
const router = express.Router();
    
//  Demander un prêt
    
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { book, borrower, owner } = req.body;
        const loan = new Loan({ book, borrower, owner });
        await loan.save();
        res.status(201).json(loan);
    })
);
    
//  Obtenir les prêts d'un utilisateur
router.get(
    "/:userId",
    asyncHandler(async (req, res) => {
        const loans = await Loan.find({ borrower: req.params.userId }).populate("book owner", "title name email");
        res.json(loans);
    })
);
    
export default router;