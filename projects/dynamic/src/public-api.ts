/*
 * Public API Surface of dynamic
 */

import { DynamicElementsLoader } from './lib/dynamic';

// Ejecuta el loader al cargar la librería
const loader = new DynamicElementsLoader();

export * from './lib/dynamic';
export * from './lib/datagrid/datagrid';
