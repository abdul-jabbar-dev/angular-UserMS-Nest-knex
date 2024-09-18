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
var FileSystemService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let FileSystemService = FileSystemService_1 = class FileSystemService {
    constructor() {
        this.logger = new common_1.Logger(FileSystemService_1.name);
        this.filePath = path.join(__dirname, "users.json");
    }
    async writeUserData(users) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
        }
        catch (error) {
            this.logger.error("Failed to write user data to file", error.stack);
        }
    }
    async readUserData() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, "utf-8");
                return JSON.parse(data);
            }
            return {};
        }
        catch (error) {
            this.logger.error("Failed to read user data from file", error.stack);
            return {};
        }
    }
};
exports.FileSystemService = FileSystemService;
exports.FileSystemService = FileSystemService = FileSystemService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileSystemService);
//# sourceMappingURL=file-system.service.js.map