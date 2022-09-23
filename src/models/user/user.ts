import { Role } from '../role';

export type User = {
    email: string;
    name: string;
    password: string;
    role: Role;
    dob?: Date;

    // additional attrs required by other features
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
}