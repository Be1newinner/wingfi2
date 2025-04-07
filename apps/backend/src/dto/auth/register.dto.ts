import { GENDER, ROLE } from "@/types/user.types";
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsEnum(GENDER)
  gender!: string;

  @IsEnum(ROLE)
  role!: string;

  @IsPhoneNumber("IN")
  phone!: string;
}
