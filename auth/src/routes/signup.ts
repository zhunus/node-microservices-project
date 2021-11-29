import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@gzhtickets/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 and 20'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(`User with ${email} email already exists`);
    }

    const newUser = User.build({ email, password });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: token };

    res.status(201).send(newUser);
  }
);

export { router as signupRouter };
