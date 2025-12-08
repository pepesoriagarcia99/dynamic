import { Request } from "express";
import { FilterEvent, SortType } from "../model/FilterEvent";

const filterRegex = /^filter\[(\d+)\]\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/;
const sortRegex = /^sort\[(\d+)\]\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/;

/**
 * Implementacion estatica de FilterParser
 * Transforma los parametros http en un FilterEvent
 * 
 * * Se podria mejorar implementando algun patron que adapte el codigo a diferentes tecnologias de api rest
 */
export class FilterParamsParser {
  output: FilterEvent = {
    filters: [],
    sorts: [],
  };

  constructor(req: Request) {
    for (const key in req.query) {
      // page
      if (key === 'page') {
        const pageStr = req.query[key];
        const page = parseInt(pageStr as string);
        if (!isNaN(page)) {
          this.output.page = page;
        }
      }

      // pageSize
      if (key === 'pageSize') {
        const pageSizeStr = req.query[key];
        const pageSize = parseInt(pageSizeStr as string);
        if (!isNaN(pageSize)) {
          this.output.pageSize = pageSize;
        }
      }

      // filtros
      const filterMatch = key.match(filterRegex);
      if (filterMatch) {
        const index = filterMatch[1];
        const field = filterMatch[2];
        const value = req.query[key];


        this.output.filters!.push({ index, field, value: (value as string) ?? '' });
      }

      // ordenaciones
      const sortMatch = key.match(sortRegex);
      if (sortMatch) {
        const index = sortMatch[1];
        const field = sortMatch[2];
        const strType = req.query[key];

        const type = (strType as string)?.toUpperCase() === 'DESC' ? SortType.DESC : SortType.ASC;

        this.output.sorts!.push({ index, field, type });
      }
    }
  }

  getEvent() {
    return this.output;
  }
}