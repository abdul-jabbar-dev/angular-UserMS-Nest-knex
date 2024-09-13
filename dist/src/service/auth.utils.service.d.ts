import { KnexService } from "./knex.service";
export declare class AuthUtilsService {
    private readonly knexService;
    constructor(knexService: KnexService);
    private solt;
    makeHashed(pass: string): Promise<string>;
    compareHashed(hashedPass: string, newPass: string): Promise<boolean>;
    generateUniqueUsername(firstName: string, lastName: string): Promise<string>;
}
