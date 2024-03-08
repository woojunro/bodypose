import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateEditorInput } from './create-editor.dto';

@InputType()
export class UpdateEditorInput extends PartialType(CreateEditorInput) {
  @Field(type => Int)
  id: number;
}
