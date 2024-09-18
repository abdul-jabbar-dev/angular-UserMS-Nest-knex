export declare class FileSystemService {
    private readonly filePath;
    private readonly logger;
    constructor();
    writeUserData(users: Record<string, any>): Promise<void>;
    readUserData(): Promise<Record<string, any>>;
}
