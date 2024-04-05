export interface ApplePodcastSearchResult_Podcast {
  wrapperType: 'track';
  kind: string;
  artistId?: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl?: string;
  collectionViewUrl: string;
  feedUrl?: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  collectionHdPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  trackTimeMillis?: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating?: string;
  artworkUrl600: string;
  genreIds: string[];
  genres: string[];
}

export interface ApplePodcastSearchResult_Episode {
  wrapperType: 'podcastEpisode';
  kind: string;
  feedUrl: string;
  episodeUrl: string;
  description: string;
  trackId: number;
  trackName: string;
  shortDescription: string;
  releaseDate: string;
  closedCaptioning: string;
  collectionId: number;
  collectionName: string;
  artistIds: number[];
  country: string;
  artworkUrl60: string;
  artistViewUrl: string;
  contentAdvisoryRating: string;
  trackViewUrl: string;
  previewUrl: string;
  artworkUrl600: string;
  episodeContentType: string;
  episodeFileExtension: string;
  collectionViewUrl: string;
  trackTimeMillis: number;
  artworkUrl160: string;
  genres: {
    name: string;
    id: string;
  };
  episodeGuid: string;
}

export type ApplePodcastSearchResult =
  | ApplePodcastSearchResult_Podcast
  | ApplePodcastSearchResult_Episode;

export const fetchPodcasts = async (
  listings: number
): Promise<ApplePodcastSearchResult[]> => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=podcast&media=podcast&limit=${listings}`
  );
  return response.json().then((res) => res.results);
};

export const searchMostRecentEpisodesForPodcast = async (
  podcastId: number,
  listings: number
): Promise<ApplePodcastSearchResult[]> => {
  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode&limit=${listings}&sort=recent`
  );
  return response
    .json()
    .then((res) => (res.resultCount > 1 ? res.results.slice(1) : []));
};

export const lookupEpisode = async (podcastId: number) => {
  const response = await fetch(
    `https://itunes.apple.com/lookup?id=${podcastId}`
  );
  return response.json().then((res) => res.results);
};
