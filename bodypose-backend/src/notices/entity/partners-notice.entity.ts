import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { Notice } from './notice.entity';

@Entity()
@ObjectType()
export class PartnersNotice extends Notice {}
