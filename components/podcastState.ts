import { atom } from 'jotai';
import { ApplePodcastSearchResult } from './searchApplePodcast';

export const podcastEpisodeAtom = atom<ApplePodcastSearchResult>(
  {} as ApplePodcastSearchResult
);
