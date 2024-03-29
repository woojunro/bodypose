import { CoreOutput } from '../dtos/output.dto';

export const UNEXPECTED_ERROR: CoreOutput = {
  ok: false,
  error: 'UNEXPECTED_ERROR',
};

export const CommonError = (errorMessage: string): CoreOutput => ({
  ok: false,
  error: errorMessage,
});

export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
