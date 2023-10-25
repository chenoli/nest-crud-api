import { User } from '../models/users.model';

export type UserResponse = {
  user: Omit<User, 'password'>;
  token: string;
};
