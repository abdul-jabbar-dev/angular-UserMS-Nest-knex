import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TUser, TUserResponse, Tlogin } from "src/types/User";

@Controller("user")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("get_my_profile")
  async myprofile(@Body() { user_id }) {
    try {
      return await this.authService.UserProfile(user_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get("get_users")
  async getUsers(
    @Query()
    {
      pageSize = 5,
      page = 1,
      role,
    }: {
      pageSize: string | number;
      page: string | number;
      role?: "admin" | "subscriber";
    }
  ): Promise<{
    data: TUserResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return await this.authService.getUsers({ pageSize, page, role });
  }

  @Get("get_user/:id")
  async getUser(@Param("id") id: string): Promise<TUserResponse | null> {
    const userId = parseInt(id);
    return await this.authService.getUserById(userId);
  }

  @Get("get_rider")
  async getrider(): Promise<TUserResponse[] | null> {
    return await this.authService.getRiders();
  }
  @Get("rider/get_history")
  async getRiderHistory(@Body() { user_id }) {
    return await this.authService.getRiderHistory(user_id);
  }

  @Post("register")
  async registerUser(
    @Body() user: TUser
  ): Promise<{ data: TUserResponse; token: string } | null> {
    try {
      return await this.authService.registerUser(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post("login")
  async loginUser(@Body() user: Tlogin) {
    try {
      return await this.authService.loginUser(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post("send_code")
  async send_code_for_reset(@Body() { email }) {
    
    try {
      return await this.authService.send_code_for_reset(email);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post("send_new_password/:id")
  async gen_new_pass(@Param("id") id: string, @Body() password) {
     
    try {
      return await this.authService.gen_new_pass(id,password);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put("status_update/:id")
  async updateStatus(@Param("id") id: string) {
    return await this.authService.userStatusUpdate(id);
  }
  @Put("role_update/:id")
  async updateRole(@Param("id") id: string) {
    return await this.authService.userUpdateRole(id);
  }
  @Delete("delete/:id")
  async deleteUser(@Param("id") id: string) {
    return await this.authService.UserDeleteRoute(id);
  }

  @Put("update_profile")
  async updateProfile(@Body() user: Partial<TUser & { user_id: string }>) {
    try {
      const result = await this.authService.UserUpdateProfile(user);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
