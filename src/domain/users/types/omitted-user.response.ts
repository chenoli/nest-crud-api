import { User } from '../models/users.model';

export type OmittedUserResponse = Omit<User, 'password'>;
