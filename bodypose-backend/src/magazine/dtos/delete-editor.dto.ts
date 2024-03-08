import { InputType, PickType } from '@nestjs/graphql';
import { Editor } from '../entities/editor.entity';

@InputType()
export class DeleteEditorInput extends PickType(Editor, ['id'], InputType) {}
