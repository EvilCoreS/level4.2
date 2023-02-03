export interface GeneralRepositoryInterface<T> {
  findByID(id: number): Promise<T>;

  create(data: Partial<T>): T;

  save(data: T): Promise<T>;

  remove(data: T): Promise<T>;

  preload(data: Partial<T>): Promise<T>;
}
