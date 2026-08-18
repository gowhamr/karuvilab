export interface TipTapMark {
  type: string;
  attrs?: Record<string, any> | undefined;
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, any> | undefined;
  content?: TipTapNode[] | undefined;
  marks?: TipTapMark[] | undefined;
  text?: string | undefined;
}

export interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}
