import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreateCompanyDto {
    @IsNotEmpty({
        message: "fact u"
    })
    @IsString()
    @IsEmail()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
