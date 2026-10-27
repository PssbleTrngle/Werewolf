export type WithPassthroughProps<T> = Readonly<T> & {
  id?: string;
  className?: string;
};
