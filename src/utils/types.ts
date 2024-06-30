export interface ColorTableInterface {
  [key: string]: string;
}
export interface PaletteInterface {
  id: string;
  step: number;
  name: string;
  swatches: SwatchInterface[];
}

export interface SwatchInterface {
  id: string;
  color: string;
  tag: string;
}

export interface ModalStateInterface {
  isOpen: boolean;
  mode: "add" | "edit" | "delete";
  colorId?: string;
}
