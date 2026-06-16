export interface UserProfile {
  id: string;
  ism: string;
  familiya: string;
  email: string;
  telefon: string;
  manzil?: string;
  yerMaydoni?: string;
  avatar?: string;
  createdAt: Date;
}

export interface CreateUserDto {
  ism: string;
  familiya: string;
  email: string;
  telefon: string;
  password: string;
  manzil?: string;
}
