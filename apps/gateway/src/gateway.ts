import {
	AuthenticatedSocket,
	AuthService,
	ClientAuthGuard,
	User
} from '@app/common/auth';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Observable } from 'rxjs';

@WebSocketGateway()
@UseGuards(ClientAuthGuard)
export class Gateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
	@WebSocketServer()
	server;
	connectedUsers: string[] = [];
	constructor(private readonly authService: AuthService) {
		// console.log(this.authService);
		// this.server.use(this.middleware);
		this.middleware = this.middleware.bind(this);
	}
	onModuleInit() {
		this.server.use(this.middleware);
	}

	async middleware(socket: AuthenticatedSocket, next) {
		const { authorization: clientAuthorization } = socket.handshake.headers;
		if (!clientAuthorization) {
			return next(new Error('Not Authenticated. No cookies were sent'));
		}
		const clientAuthorizationArr = clientAuthorization.split(' ');
		const jwt = clientAuthorizationArr[clientAuthorizationArr.length - 1];
		const user = await this.authService?.getJwtUser(jwt);
		if (!user) {
			return next(new Error('Invalid authorization'));
		}
		socket.user = user;
		next();
	}

	async handleConnection(socket) {
		// const user: User = await this.jwtService.verify(
		// 	socket.handshake.query.token,
		// 	true
		// );
		const user: User = socket.user;
		console.log('socket.user', socket.user);

		this.connectedUsers = [...this.connectedUsers, String(user?.id)];
		console.log('this.connectedUsers', this.connectedUsers);
		// Send list of connected users
		this.server.emit('users', this.connectedUsers);
	}

	async handleDisconnect(socket) {
		const user: User = socket.user;
		const userPos = this.connectedUsers.indexOf(String(user?.id));

		if (userPos > -1) {
			this.connectedUsers = [
				...this.connectedUsers.slice(0, userPos),
				...this.connectedUsers.slice(userPos + 1)
			];
		}

		// Sends the new list of connected users
		this.server.emit('users', this.connectedUsers);
	}

	@SubscribeMessage('message')
	async onMessage(client, data: any) {
		const event = 'message';
		const result = data[0];
		console.log('onMessage client.user', client.user);
		// await this.roomService.addMessage(result.message, result.room);
		// client.broadcast.to(result.room).emit(event, result.message);
		this.server.emit('newMessage', data);
		return Observable.create((observer) =>
			observer.next({ event, data: result.message })
		);
	}

	@SubscribeMessage('join')
	async onRoomJoin(client, data: any): Promise<any> {
		client.join(data[0]);

		// const messages = await this.roomService.findMessages(data, 25);

		// // Send last messages to the connected user
		// client.emit('message', messages);
	}

	@SubscribeMessage('leave')
	onRoomLeave(client, data: any): void {
		client.leave(data[0]);
	}
}
