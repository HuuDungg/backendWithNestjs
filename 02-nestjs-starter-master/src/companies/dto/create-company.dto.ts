import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    description: string;


}
