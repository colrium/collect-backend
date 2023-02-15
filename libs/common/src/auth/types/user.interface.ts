import { Role } from '../types';

export interface IUser {
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	roles: Role[];
	staffId: string;
	status: string;
}
