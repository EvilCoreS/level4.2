import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    const iterObj = Object.keys(new CreatePersonDto());
    const checker = iterObj.every((name) => {
      return name in createPersonDto;
    });
    if (checker) return this.peopleService.create(createPersonDto);
    else throw new BadRequestException('Missing properties');
  }

  @Get()
  findAll(
    @Query('order', ParseIntPipe) order: number,
    @Query('count', ParseIntPipe) count: number,
  ) {
    return this.peopleService.findAll(order, count);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    const keys = Object.keys(updatePersonDto);
    const checker = keys.every((name) => {
      const iterObj = Object.keys(new UpdatePersonDto());
      return iterObj.includes(name);
    });
    if (checker) return this.peopleService.update(id, updatePersonDto);
    else throw new BadRequestException('Incorrect property name');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.remove(id);
  }
}
