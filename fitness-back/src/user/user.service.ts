import { Injectable } from '@nestjs/common';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaDbService) {}

  async getUserById(id: number) {
    const userInfo = await this.prismaService.user.findUnique({
      where: { id },
    });

    delete userInfo.password;
    return { userInfo };
  }
}
