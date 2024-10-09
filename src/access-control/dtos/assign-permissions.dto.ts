import { IsArray } from "class-validator";

export abstract class AssignPermissionsDto {
  @IsArray()
  permissionIds: number[];
}