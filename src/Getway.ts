import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "http";
import { Socket } from "socket.io";

@WebSocketGateway()
export class MyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  clients: Map<string, Socket> = new Map();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("MyGateway");

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway Initialized");
    console.log("WebSocket Gateway Initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userID as string;
    this.clients.set(userId, client);

    this.logger.log(`Client connected: ${client.id}, userID:${userId}`);
    client.emit("connection", "Welcome to the WebSocket server");

    this.sendActiveUsers(client);
  }

  handleDisconnect(client: Socket) {
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
      this.sendActiveUsers(client);
    });
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("messageToServer")
  handleMessage(client: Socket, payload: any): string {
    this.logger.log(`Message received from client: ${payload}`);
    return "Hello from server";
  }

  @SubscribeMessage("privateMessage")
  handlePrivateMessage(
    client: Socket,
    data: { userId: string; message: string }
  ): void {
    const targetClient = this.clients.get(data.userId);
    if (targetClient) {
      targetClient.emit("privateMessage", data.message);
    } else {
      client.emit("error", "User not connected");
    }
  }

  @SubscribeMessage("getActiveUsers")
  handleGetActiveUsers(client: Socket): void {
    this.sendActiveUsers(client);
  }

  sendActiveUsers(client) {
    const activeUsers = Array.from(this.clients.keys());
    client.emit("activeUsers", activeUsers);
  }
}
