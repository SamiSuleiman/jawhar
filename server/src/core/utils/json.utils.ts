import { Result } from './utils.model';

export class Json {
  static safeParse<T>(json: string): Result<T> {
    try {
      return { status: 'success', data: JSON.parse(json), error: null };
    } catch (error) {
      return { status: 'failure', data: null, error: 'Invalid JSON' };
    }
  }
}
