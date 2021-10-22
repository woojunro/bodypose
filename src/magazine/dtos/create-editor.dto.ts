import { InputType, PickType } from '@nestjs/graphql';
import { Editor } from '../entities/editor.entity';

@InputType()
export class CreateEditorInput extends PickType(
  Editor,
  ['name', 'logoUrl'],
  InputType,
) {}
