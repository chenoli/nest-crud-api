import { Prisma } from '@prisma/client';

export class User implements Prisma.UsersCreateInput {
  id?: string;
  email: string;
  username: string;
  password: string;
  profile_picture?: string;
  profile_banner?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}
