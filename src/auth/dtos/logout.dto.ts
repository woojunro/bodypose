import { IsBoolean } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class LogoutInput {
  @IsBoolean()
  fromAllDevices: boolean;
}

export class LogoutOutput extends CoreOutput {}
