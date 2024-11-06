import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

  create(createCompanyDto: CreateCompanyDto) {
    return this.companyModel.create(createCompanyDto);
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(id: string) {
    return this.companyModel.findOne({ _id: id });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const company = this.companyModel.updateOne({ _id: id }, { ...updateCompanyDto, updatedBy: { _id: user._id, email: user.email } });
    return company;
  }

  remove(id: string) {
    return this.companyModel.softDelete({ _id: id });
  }
}
