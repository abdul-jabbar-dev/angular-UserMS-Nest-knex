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
@WebSocketGateway({
  path: "/realtime",
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
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
    const userId = client.handshake.query.userId as string;

    if (!userId) {
      this.logger.error(`Connection failed: userID missing from handshake`);
      client.emit("error", "userID is required to connect");
      client.disconnect(true);
      return;
    }

    this.clients.set(userId, client);
    this.logger.log(`Client connected: ${client.id}, userID: ${userId}`);
    client.emit("connection", "Welcome to the WebSocket server");

    this.broadcastActiveUsers();
  }

  handleDisconnect(client: Socket) {
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
      this.broadcastActiveUsers();
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
      client.emit("privateMessageStatus", "Message delivered");
    } else {
      client.emit("privateMessageStatus", "User not connected");
    }
  }

  @SubscribeMessage("activeUsers")
  handleGetActiveUsers(client: Socket) {
    this.broadcastActiveUsers(); // Send current active users to the client
  }

  protected broadcastActiveUsers() {
    const activeUsers = Array.from(this.clients.keys());
    this.logger.log(
      `Broadcasting active users: ${JSON.stringify(activeUsers)}`
    );
    this.server.emit("activeUsers", activeUsers);
  }
}
