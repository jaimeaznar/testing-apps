export interface Issue {
  key: string;
  fields: any;
  id: null;
  selfUri?: string;
}

export interface Content {
  attrs?: {
    url?: string;
    href?: string;
  };
  type: string;
  content?: Content[];
  text?: string;
  marks?: Content[];
}

export interface Doc {
  version: number;
  type: string;
  content: Content[];
}

export interface ScreenField {
  [key: string]: any;
}

export interface FixVersion {
  archived: boolean;
  id: string;
  name: string;
  overdue: boolean;
  projectId: number;
  releaseDate: string;
  released: boolean;
  self: string;
  startDate: string;
  userReleaseDate: string;
  userStartDate: string;
}
