import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server } from "http";
import { Socket } from "socket.io";
export declare class MyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    clients: Map<string, Socket>;
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, payload: any): string;
    handlePrivateMessage(client: Socket, data: {
        userId: string;
        message: string;
    }): void;
    handleGetActiveUsers(client: Socket): void;
    protected broadcastActiveUsers(): void;
}
