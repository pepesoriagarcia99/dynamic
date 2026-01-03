import type Pagination from "../../components/Pagination.svelte";
import { Entrypoint } from "./Entrypoint";

export const declarePublicApi = (el: HTMLElement, paginationRef: Pagination) => {
  if (!el) return;

  const host = (el?.getRootNode() as ShadowRoot)?.host;
  if (!host) return;

  const entrypoint = new Entrypoint(paginationRef);
  (host as any).filter = entrypoint.filter;
  (host as any).pagination = entrypoint.pagination;
//   (host as any).selection = selection();
//   (host as any).sort = sort();
};