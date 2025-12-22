import { z } from "zod";

export type ExternalUrlObject = Partial<{
  spotify: string;
}>;
export type FollowersObject = Partial<{
  href: string | null;
  total: number;
}>;
export type ImageObject = {
  url: string;
  height: number | null;
  width: number | null;
};
export type SimplifiedArtistObject = Partial<{
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}>;
export type TrackObject = Partial<{
  album: SimplifiedAlbumObject;
  artists: Array<SimplifiedArtistObject>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIdObject;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: object;
  restrictions: TrackRestrictionObject;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}>;
export type SimplifiedAlbumObject = AlbumBase & {
  artists: Array<SimplifiedArtistObject>;
};
export type AlbumBase = {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: AlbumRestrictionObject | undefined;
  type: "album";
  uri: string;
};
export type AlbumRestrictionObject = Partial<{
  reason: "market" | "product" | "explicit";
}>;
export type ExternalIdObject = Partial<{
  isrc: string;
  ean: string;
  upc: string;
}>;
export type TrackRestrictionObject = Partial<{
  reason: string;
}>;
export type EpisodeObject = EpisodeBase & {
  show: SimplifiedShowObject;
};
export type EpisodeBase = {
  audio_preview_url: string | null;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  is_externally_hosted: boolean;
  is_playable: boolean;
  language?: string | undefined;
  languages: Array<string>;
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  resume_point?: ResumePointObject | undefined;
  type: "episode";
  uri: string;
  restrictions?: EpisodeRestrictionObject | undefined;
};
export type ResumePointObject = Partial<{
  fully_played: boolean;
  resume_position_ms: number;
}>;
export type EpisodeRestrictionObject = Partial<{
  reason: string;
}>;
export type SimplifiedShowObject = ShowBase & {};
export type ShowBase = {
  available_markets: Array<string>;
  copyrights: Array<CopyrightObject>;
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  is_externally_hosted: boolean;
  languages: Array<string>;
  media_type: string;
  name: string;
  publisher: string;
  type: "show";
  uri: string;
  total_episodes: number;
};
export type CopyrightObject = Partial<{
  text: string;
  type: string;
}>;
export type PagingObject = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
export type SimplifiedAudiobookObject = AudiobookBase & {};
export type AudiobookBase = {
  authors: Array<AuthorObject>;
  available_markets: Array<string>;
  copyrights: Array<CopyrightObject>;
  description: string;
  html_description: string;
  edition?: string | undefined;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  languages: Array<string>;
  media_type: string;
  name: string;
  narrators: Array<NarratorObject>;
  publisher: string;
  type: "audiobook";
  uri: string;
  total_chapters: number;
};
export type AuthorObject = Partial<{
  name: string;
}>;
export type NarratorObject = Partial<{
  name: string;
}>;
export type ChapterBase = {
  audio_preview_url: string | null;
  available_markets?: Array<string> | undefined;
  chapter_number: number;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: Array<ImageObject>;
  is_playable: boolean;
  languages: Array<string>;
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  resume_point?: ResumePointObject | undefined;
  type: "episode";
  uri: string;
  restrictions?: ChapterRestrictionObject | undefined;
};
export type ChapterRestrictionObject = Partial<{
  reason: string;
}>;
export type ErrorObject = {
  status: number;
  message: string;
};

export const ExternalUrlObject = z
  .object({ spotify: z.string() })
  .partial()
  .passthrough();
export const ImageObject = z
  .object({
    url: z.string(),
    height: z.number().int().nullable(),
    width: z.number().int().nullable(),
  })
  .passthrough();
export const AlbumRestrictionObject = z
  .object({ reason: z.enum(["market", "product", "explicit"]) })
  .partial()
  .passthrough();
export const AlbumBase = z
  .object({
    album_type: z.enum(["album", "single", "compilation"]),
    total_tracks: z.number().int(),
    available_markets: z.array(z.string()),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.enum(["year", "month", "day"]),
    restrictions: AlbumRestrictionObject.optional(),
    type: z.literal("album"),
    uri: z.string(),
  })
  .passthrough();
export const SimplifiedArtistObject = z
  .object({
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    name: z.string(),
    type: z.literal("artist"),
    uri: z.string(),
  })
  .partial()
  .passthrough();
export const PagingObject = z
  .object({
    href: z.string(),
    limit: z.number().int(),
    next: z.string().nullable(),
    offset: z.number().int(),
    previous: z.string().nullable(),
    total: z.number().int(),
  })
  .passthrough();
export const TrackRestrictionObject = z
  .object({ reason: z.string() })
  .partial()
  .passthrough();
export const CopyrightObject = z
  .object({ text: z.string(), type: z.string() })
  .partial()
  .passthrough();
export const ExternalIdObject = z
  .object({ isrc: z.string(), ean: z.string(), upc: z.string() })
  .partial()
  .passthrough();
export const FollowersObject = z
  .object({ href: z.string().nullable(), total: z.number().int() })
  .partial()
  .passthrough();
export const SimplifiedAlbumObject = AlbumBase.and(
  z.object({ artists: z.array(SimplifiedArtistObject) }).passthrough()
);
export const TrackObject = z
  .object({
    album: SimplifiedAlbumObject,
    artists: z.array(SimplifiedArtistObject),
    available_markets: z.array(z.string()),
    disc_number: z.number().int(),
    duration_ms: z.number().int(),
    explicit: z.boolean(),
    external_ids: ExternalIdObject,
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    is_playable: z.boolean(),
    linked_from: z.object({}).partial().passthrough(),
    restrictions: TrackRestrictionObject,
    name: z.string(),
    popularity: z.number().int(),
    preview_url: z.string().nullable(),
    track_number: z.number().int(),
    type: z.literal("track"),
    uri: z.string(),
    is_local: z.boolean(),
  })
  .partial()
  .passthrough();
export const ShowBase = z
  .object({
    available_markets: z.array(z.string()),
    copyrights: z.array(CopyrightObject),
    description: z.string(),
    html_description: z.string(),
    explicit: z.boolean(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    is_externally_hosted: z.boolean(),
    languages: z.array(z.string()),
    media_type: z.string(),
    name: z.string(),
    publisher: z.string(),
    type: z.literal("show"),
    uri: z.string(),
    total_episodes: z.number().int(),
  })
  .passthrough();
export const ResumePointObject = z
  .object({ fully_played: z.boolean(), resume_position_ms: z.number().int() })
  .partial()
  .passthrough();
export const EpisodeRestrictionObject = z
  .object({ reason: z.string() })
  .partial()
  .passthrough();
export const EpisodeBase = z
  .object({
    audio_preview_url: z.string().nullable(),
    description: z.string(),
    html_description: z.string(),
    duration_ms: z.number().int(),
    explicit: z.boolean(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    is_externally_hosted: z.boolean(),
    is_playable: z.boolean(),
    language: z.string().optional(),
    languages: z.array(z.string()),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.enum(["year", "month", "day"]),
    resume_point: ResumePointObject.optional(),
    type: z.literal("episode"),
    uri: z.string(),
    restrictions: EpisodeRestrictionObject.optional(),
  })
  .passthrough();
export const SimplifiedShowObject = ShowBase.and(
  z.object({}).partial().passthrough()
);
export const EpisodeObject = EpisodeBase.and(
  z.object({ show: SimplifiedShowObject }).passthrough()
);
export const AuthorObject = z
  .object({ name: z.string() })
  .partial()
  .passthrough();
export const NarratorObject = z
  .object({ name: z.string() })
  .partial()
  .passthrough();
export const AudiobookBase = z
  .object({
    authors: z.array(AuthorObject),
    available_markets: z.array(z.string()),
    copyrights: z.array(CopyrightObject),
    description: z.string(),
    html_description: z.string(),
    edition: z.string().optional(),
    explicit: z.boolean(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    languages: z.array(z.string()),
    media_type: z.string(),
    name: z.string(),
    narrators: z.array(NarratorObject),
    publisher: z.string(),
    type: z.literal("audiobook"),
    uri: z.string(),
    total_chapters: z.number().int(),
  })
  .passthrough();
export const ChapterRestrictionObject = z
  .object({ reason: z.string() })
  .partial()
  .passthrough();
export const ChapterBase = z
  .object({
    audio_preview_url: z.string().nullable(),
    available_markets: z.array(z.string()).optional(),
    chapter_number: z.number().int(),
    description: z.string(),
    html_description: z.string(),
    duration_ms: z.number().int(),
    explicit: z.boolean(),
    external_urls: ExternalUrlObject,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    is_playable: z.boolean(),
    languages: z.array(z.string()),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.enum(["year", "month", "day"]),
    resume_point: ResumePointObject.optional(),
    type: z.literal("episode"),
    uri: z.string(),
    restrictions: ChapterRestrictionObject.optional(),
  })
  .passthrough();
export const SimplifiedAudiobookObject = AudiobookBase.and(
  z.object({}).partial().passthrough()
);
export const ErrorObject = z
  .object({
    status: z.number().int().min(400).max(599),
    message: z.string(),
  })
  .passthrough();
