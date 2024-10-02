interface PaginatedResponse<T> {
    page: number;
    limit: number;
    total: number;
    items: T[];
  }