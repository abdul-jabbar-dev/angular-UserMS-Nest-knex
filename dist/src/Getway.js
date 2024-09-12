"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
let MyGateway = class MyGateway {
    constructor() {
        this.clients = new Map();
        this.logger = new common_1.Logger("MyGateway");
    }
    afterInit(server) {
        this.logger.log("WebSocket Gateway Initialized");
        console.log("WebSocket Gateway Initialized");
    }
    handleConnection(client, ...args) {
        const userId = client.handshake.query.userID;
        this.clients.set(userId, client);
        this.logger.log(`Client connected: ${client.id}, userID:${userId}`);
        client.emit("connection", "Welcome to the WebSocket server");
        this.sendActiveUsers(client);
    }
    handleDisconnect(client) {
        this.clients.forEach((value, key) => {
            if (value.id === client.id) {
                this.clients.delete(key);
            }
            this.sendActiveUsers(client);
        });
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(client, payload) {
        this.logger.log(`Message received from client: ${payload}`);
        return "Hello from server";
    }
    handlePrivateMessage(client, data) {
        const targetClient = this.clients.get(data.userId);
        if (targetClient) {
            targetClient.emit("privateMessage", data.message);
        }
        else {
            client.emit("error", "User not connected");
        }
    }
    handleGetActiveUsers(client) {
        this.sendActiveUsers(client);
    }
    sendActiveUsers(client) {
        const activeUsers = Array.from(this.clients.keys());
        client.emit("activeUsers", activeUsers);
    }
};
exports.MyGateway = MyGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", http_1.Server)
], MyGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("messageToServer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", String)
], MyGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("privateMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handlePrivateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getActiveUsers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MyGateway.prototype, "handleGetActiveUsers", null);
exports.MyGateway = MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)()
], MyGateway);
//# sourceMappingURL=Getway.js.map