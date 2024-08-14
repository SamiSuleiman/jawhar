type Success<T> = {
  status: 'success';
  data: T;
  error: null;
};

type Failure = {
  status: 'failure';
  data: null;
  error: string;
};

export type Result<T> = Success<T> | Failure;
