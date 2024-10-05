import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { isNull, isUndefined } from './utils/validation.util';
import { PrismaClient } from '@prisma/client';
import { IMessage } from './interfaces/message.interface';
import { v4 } from 'uuid';

@Injectable()
export class CommonService {
  private readonly loggerService: LoggerService;

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.loggerService = new Logger(CommonService.name);
  }

  /**
   * Throw Duplicate Error
   *
   * Checks is an error is of the code 23505, PostgreSQL's duplicate value error,
   * and throws a conflict exception
   */
  public async throwDuplicateError<T>(promise: Promise<T>, message?: string) {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);

      if (error.code === '23505') {
        throw new ConflictException(message ?? 'Duplicated value in database');
      }

      throw new BadRequestException(error.message);
    }
  }

  /**
   * Throw Internal Error
   *
   * Function to abstract throwing internal server exception
   */
  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Check Entity Existence
   *
   * Checks if a findOne query didn't return null or undefined
   */
  public checkEntityExistence<T extends Record<string, any>>(
    entity: T | null | undefined,
    name: string,
  ): void {
    if (isNull(entity) || isUndefined(entity)) {
      throw new NotFoundException(`${name} not found`);
    }
  }

  /**
   * Remove Entity
   *
   * Removes an entity from the DB
   */
  public async removeEntity<T extends Record<string, any>>(
    entity: T,
  ): Promise<void> {
    // Assuming entity has an id field and a type field to determine its table
    const table = entity.constructor.name.toLowerCase();
    await this.prisma[table].delete({
      where: { id: entity.id },
    });
  }

  /**
   * Format Name
   *
   * Takes a string trims it and capitalizes every word
   */
  public formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  // data?: object, 
  public generateMessage(message: string): IMessage {
    return { id: v4(), message };
  }

  public generateResponse() {
    
  }
}
