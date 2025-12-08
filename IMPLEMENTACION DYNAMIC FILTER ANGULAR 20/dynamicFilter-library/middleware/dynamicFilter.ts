import { NextFunction, Request, Response } from 'express';
import { FilterParamsParser } from '../service/FilterParamsParser';

/**
 * Middleware para express para el parseo de filtros
 *
 * @returns
 */
export const dynamicFilter = () => (req: Request, res: Response, next: NextFunction) => {
  const filterParser = new FilterParamsParser(req);

  req['filterEvent'] = filterParser.getEvent();

  next();
};
