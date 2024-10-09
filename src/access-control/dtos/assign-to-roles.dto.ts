import { IsArray } from "class-validator";

export abstract class AssignToRolesDto {
  @IsArray()
  roleIds: number[];
}