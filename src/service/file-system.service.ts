import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FileSystemService {
  private readonly filePath: string;
  private readonly logger: Logger = new Logger(FileSystemService.name);

  constructor() {
    this.filePath = path.join(__dirname, "users.json");
  }

  async writeUserData(users: Record<string, any>): Promise<void> {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    } catch (error) {
      this.logger.error("Failed to write user data to file", error.stack);
    }
  }

  async readUserData(): Promise<Record<string, any>> {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      this.logger.error("Failed to read user data from file", error.stack);
      return {};
    }
  }
}
