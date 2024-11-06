import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { }

  getHashPassword = (password: string): string => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword = (password: string, hash: string): boolean => {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    createUserDto.password = this.getHashPassword(createUserDto.password)
    await this.userModel.create(createUserDto);
    return (createUserDto);
  }

  findAll(): object {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<object> {
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }

  async findByName(userName: string): Promise<object> {
    const user = await this.userModel.findOne({ name: userName });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.deleteOne({ _id: id });
    return user;
  }
}
