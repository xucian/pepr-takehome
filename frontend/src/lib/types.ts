export interface AdvertiserInfo {
  name: string;
  profileImage: string | null;
  pageUrl: string | null;
}

export interface CreativeContent {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  text: string;
  cta: string | null;
}

export interface AdMetadata {
  platform: 'instagram';
  format: 'story';
  destinationUrl: string | null;
}

export interface AdData {
  advertiser: AdvertiserInfo;
  creative: CreativeContent;
  metadata: AdMetadata;
}

export interface ParseAdResponse {
  success: boolean;
  data?: AdData;
  error?: string;
}
