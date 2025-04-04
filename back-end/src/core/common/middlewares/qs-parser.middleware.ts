import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as qs from 'qs';

@Injectable()
export class qsParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Parse the URL with qs
    const parsedQuery = qs.parse(req.url.split('?')[1], {
      depth: 5, // Allow nested objects
      arrayLimit: 100, // Allow larger arrays
    });

    // Extract and normalize pagination parameters
    let sort = parsedQuery.sort || [];

    // Ensure sort is an array of objects with field and direction
    if (!Array.isArray(sort)) {
      if (typeof sort === 'string') {
        // Handle string format like "field:direction,field:direction"
        sort = sort.split(',').map((s) => {
          const [field, direction] = s.split(':');
          return { field, direction: direction || 'asc' };
        });
      } else {
        // Handle object format
        sort = [sort];
      }
    }

    // Construct pagination params
    req['paginationParams'] = {
      limit: parseInt(parsedQuery.limit as string, 10) || 10,
      cursor: parsedQuery.cursor,
      filter: parsedQuery.filter || {},
      sort,
    };

    next();
  }
}
