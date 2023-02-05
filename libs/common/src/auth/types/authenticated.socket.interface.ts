import { User } from '@app/common';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
	user?: User;
}
