import { AuthenticatedSocket, AuthService, User } from '@app/common/auth';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Observable } from 'rxjs';

@WebSocketGateway()
// @UseGuards(ClientAuthGuard)
export class Gateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
	logger = new Logger(Gateway.name);
	@WebSocketServer()
	server;
	connectedUsers: string[] = [];
	constructor(
		private readonly authService: AuthService,
		private eventEmmiter: EventEmitter2,
		@Inject('MQTT_SERVICE') private mqttClient: ClientProxy
	) {
		this.middleware = this.middleware.bind(this);
	}
	onModuleInit() {
		this.server.use(this.middleware);
	}

	async middleware(socket: AuthenticatedSocket, next) {
		const { authorization: clientAuthorization } = socket.handshake.headers;
		if (!clientAuthorization) {
			return next(
				new Error(
					'Not Authenticated. No authorization headers were sent'
				)
			);
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
		this.connectedUsers = [...this.connectedUsers, String(user?.id)];
		// console.log('this.connectedUsers', this.connectedUsers);
		// Send list of connected users
		this.mqttClient.send('chat_channel', ['users', this.connectedUsers]);
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
	@OnEvent('message.send')
	async onMessageEvent(data: any) {
		const event = 'message';
		console.log('this.onMessage this.mqttClient', this.mqttClient);
		try {
			this.mqttClient.send('chat_channel', data);
		} catch (error) {
			console.log('this.onMessage error', error);
		}

		this.server.emit('newMessage', data);
		// return Observable.create((observer) =>
		// 	observer.next({ event, data: data })
		// );
	}

	@SubscribeMessage('message')
	async onMessage(client: AuthenticatedSocket, data: any) {
		this.eventEmmiter.emit('message.send', data);
		return Observable.create((observer) =>
			observer.next({ event: "message", data: data })
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
