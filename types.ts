export interface Icon {
  name: string;
}

export interface JSDelivrFile {
  name: string;
  type: 'file' | 'directory';
}

export enum IconStyle {
  Filled = 'materialicons',
  Outlined = 'materialiconsoutlined',
  Round = 'materialiconsround',
  Sharp = 'materialiconssharp',
  TwoTone = 'materialiconstwotone',
}

export const iconStyleNames: { [key in IconStyle]: string } = {
  [IconStyle.Filled]: 'Filled',
  [IconStyle.Outlined]: 'Outlined',
  [IconStyle.Round]: 'Round',
  [IconStyle.Sharp]: 'Sharp',
  [IconStyle.TwoTone]: 'Two Tone',
};

export type DownloadFormat = 'svg' | 'png';
