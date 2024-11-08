import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }

  getHashPassword = (password: string): string => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword = (password: string, hash: string): boolean => {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto, user: IUser): Promise<CreateUserDto> {
    createUserDto.password = this.getHashPassword(createUserDto.password)
    await this.userModel.create({
      ...createUserDto, createdBy: {
        _id: new mongoose.Types.ObjectId(user._id)!,
        name: user.name
      }
    });
    return (createUserDto);
  }

  async register(registerUserDto: RegisterUserDto): Promise<RegisterUserDto> {
    registerUserDto.password = this.getHashPassword(registerUserDto.password)
    await this.userModel.create(registerUserDto);
    return (registerUserDto);
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

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const newUser = await this.userModel.updateOne({ _id: id }, {
      ...updateUserDto, updatedBy: {
        _id: user._id,
        name: user.name
      }
    });
    return newUser;
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    });
    const newUser = await this.userModel.softDelete({ _id: id });
    return newUser;
  }
}
