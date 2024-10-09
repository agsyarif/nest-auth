import { IsArray } from "class-validator";

export abstract class AssignToUsersDto {
  @IsArray()
  userIds: number[];
}