import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  @Query(returns => String)
  hello(): string {
    return 'Hello, world!';
  }
}
