export interface User {
  displayName: string;
  email: string;
  profilePicture: string;
}

export interface Version {
  versionNumber: number;
  when?: string;
  friendlyWhen?: string;
  modificationBy?: User;
}

export interface IframeData {
  konviwFrameUrl: string;
  konviwSpaceKey: string;
  konviwPageId: string;
  konviwTitle: string;
  konviwExcerpt: string;
  showMetadata?: boolean;
  konviwCreatedVersion: Version;
  konviwLastVersion: Version;
  labels: string[];
  readTime: number;
}
