import { InputType } from '@nestjs/graphql';
import { DeleteStudioReviewInput } from './delete-studio-review.dto';

@InputType()
export class ClickStudioReviewInput extends DeleteStudioReviewInput {}
