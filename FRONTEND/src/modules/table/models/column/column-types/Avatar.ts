// import type { Column } from '../Column';
// import { valueTransformer } from '../../../../../utils/value-transformer';
// import { ColumnType } from './ColumnType';

// export interface AvatarConfig {
//   picture: string;
// }

// export default class Avatar extends ColumnType {
//   picture: string;

//   constructor({ picture }: AvatarConfig) {
//     super();
//     this.picture = picture;
//   }

//   getValue(column: Column, row: any): any {
//     const picturePath = valueTransformer.getValue(this.picture, row);
//     const altText = column.name || 'Avatar';

//     return {
//         src: picturePath,
//         alt: altText
//     };
//   }
// }
