import { atom } from 'jotai';
import { ApplePodcastSearchResult_Episode } from './searchApplePodcast';

export interface PodcastEpisodeMetadata {
  trackId: number;
  title: string;
  description: string;
  artistName: string;
  artworkUrl: string;
  durationMs: number;
  audioUrl: string;
}

export const makePodcastEpisodeMetadata = (
  episode: ApplePodcastSearchResult_Episode,
  artistName: string
): PodcastEpisodeMetadata => {
  return {
    trackId: episode.trackId,
    title: episode.trackName,
    description: episode.description,
    artistName: artistName,
    artworkUrl: episode.artworkUrl600,
    durationMs: episode.trackTimeMillis,
    audioUrl: episode.episodeUrl,
  };
};

export const podcastEpisodeMetadataAtom = atom<PodcastEpisodeMetadata>(
  {} as PodcastEpisodeMetadata
);
