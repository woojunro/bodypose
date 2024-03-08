import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Editor } from '../entities/editor.entity';

@ObjectType()
export class AllEditorsOutput extends CoreOutput {
  @Field(type => [Editor], { nullable: true })
  editors?: Editor[];
}
