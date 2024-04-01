export interface ApplePodcastSearchResultList {
  resultCount: number;
  results: ApplePodcastSearchResult[];
}

export interface ApplePodcastSearchResult {
  wrapperType: string;
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

export const searchMostRecentPodcasts = async (
  episodes: number = 50
): Promise<ApplePodcastSearchResultList> => {
  // TODO: update this to actually show recent episodes
  const response = await fetch(
    `https://itunes.apple.com/search?term=podcast&media=podcast&limit=${episodes}`
  );
  return response.json();
};
