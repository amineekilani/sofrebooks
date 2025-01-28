import express from "express";
import { requestLoan, getLoanRequestsForOwner, acceptLoanRequest, declineLoanRequest } from "../controllers/loanRequestController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, requestLoan);
router.get("/", protect, getLoanRequestsForOwner);

router.put("/accept/:requestId", protect, acceptLoanRequest);
router.put("/decline/:requestId", protect, declineLoanRequest);

export default router;