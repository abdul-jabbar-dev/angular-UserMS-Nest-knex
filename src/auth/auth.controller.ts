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
      return await this.authService.userProfile(user_id);
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
  async getRider(): Promise<TUserResponse[] | null> {
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
  async loginUser(
    @Body()
    { email, password, meta }: { email: string; password: string; meta: any }
  ) {
    try {
      return await this.authService.loginUser({ email, password, meta });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post("send_code")
  async sendCodeForReset(@Body() { email }) {
    try {
      return await this.authService.sendCodeForReset(email);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Post("send_new_password/:id")
  async genNewPass(@Param("id") id: string, @Body() password) {
    try {
      return await this.authService.genNewPass(id, password);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put("status_update/:id")
  async updateStatus(@Param("id") id: string) {
    return await this.authService.userStatusUpdate(id);
  }
  @Put("update_password")
  async updatePassword(
    @Body()
    {
      oldPassword,
      newPassword,
      user_id,
    }: {
      oldPassword: string;
      newPassword: string;
      user_id: string | number;
    }
  ) {
    return await this.authService.updatePassword(
      oldPassword,
      newPassword,
      user_id
    );
  }
  @Put("role_update/:id")
  async updateRole(@Param("id") id: string) {
    return await this.authService.userUpdateRole(id);
  }
  @Delete("delete")
  async deleteUser(@Body() { user_id }) {
    return await this.authService.userDeleteRoute(user_id);
  }
  @Delete("delete/:id")
  async deleteUserByAdmin(@Param("id") id: string) {
    return await this.authService.userDeleteRoute(id);
  }

  @Put("update_profile")
  async updateProfile(@Body() user: Partial<TUser & { user_id: string }>) {
    try {
      const result = await this.authService.userUpdateProfile(user);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
