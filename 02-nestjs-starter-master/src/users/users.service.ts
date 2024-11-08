import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';

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

  async findAll(currentPage: number, limit: number, qs: string): Promise<object> {

    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
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
