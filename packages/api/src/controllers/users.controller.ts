import { Request, Response } from 'express';
import usersService from '../services/users.service.js';

async function getMyLikedListings(req: Request, res: Response) {
  const userId = req.user!.userId;
  const listings = await usersService.getLikedListings(userId);
  res.status(200).json(listings);
}

export default {
  getMyLikedListings,
};