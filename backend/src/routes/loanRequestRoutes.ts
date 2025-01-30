import express from "express";
import { requestLoan, getLoanRequestsForOwner, acceptLoanRequest, declineLoanRequest, returnBook, getLoanRequestsForBorrower } from "../controllers/loanRequestController";
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

router.post("/", protect, requestLoan);
router.get("/owner", protect, getLoanRequestsForOwner);
router.get("/borrower", protect, getLoanRequestsForBorrower);

router.put("/accept/:requestId", protect, acceptLoanRequest);
router.put("/decline/:requestId", protect, declineLoanRequest);

router.put("/return/:requestId", protect, returnBook);

export default router;