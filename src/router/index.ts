import {Router} from "express";
import authRouter from "@/auth/auth.controller";
import {quotesRouter} from "@/quotes/quotes.controller";
import PlaceRouter from "@/places/places.controller";
import TourRouter from "@/tours/tours.controller";
import ApplicationRouter from "@/applications/applications.controller";

const router = Router()

router.use('/auth',authRouter)
router.use('/quotes',quotesRouter);
router.use('/places',PlaceRouter);
router.use('/tours',TourRouter);
router.use('/applications',ApplicationRouter);
export default router