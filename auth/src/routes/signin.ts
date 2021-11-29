import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@gzhtickets/common';
import { User } from '../models/user';
import Password from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be supplied'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError(`Invalid email or password`);
    }

    const passwordMatching = await Password.compare(user.password, password);

    if (!passwordMatching) {
      throw new BadRequestError('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: token };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
