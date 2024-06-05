export interface ColorTableInterface {
  [key: string]: string;
}
export interface PalleteInterface {
  id: string;
  step: number;
  swatches: SwatchInterface[];
}

export interface SwatchInterface {
  id: string;
  color: string;
  tag: string;
}

export interface modalState {
  isOpen: boolean;
  mode: "add" | "edit" | "delete";
  colorId?: string;
}
