import React from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ApplePodcastSearchResult,
  searchMostRecentPodcasts,
} from '@/components/searchApplePodcast';

export default function Feed() {
  const [episodes, setEpisodes] = React.useState<ApplePodcastSearchResult[]>(
    []
  );

  React.useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await searchMostRecentPodcasts(50);
      setEpisodes(response.results);
    };
    fetchEpisodes();
  }, []);

  return (
    <View>
      <FlatList
        data={episodes}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => Alert.alert('Audio Track URL', item.trackViewUrl)}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                backgroundColor: '#fff',
              }}
            >
              <Image
                style={{ width: 80, height: 80, borderRadius: 10 }}
                source={{ uri: item.artworkUrl100 }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}
              >
                <View>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.trackName.length > 35
                      ? item.trackName.substring(0, 35) + '...'
                      : item.trackName}
                  </Text>
                  <Text>
                    {item.artistName.length > 35
                      ? item.artistName.substring(0, 35) + '...'
                      : item.artistName}
                  </Text>
                  <Text>
                    {item.primaryGenreName.length > 35
                      ? item.primaryGenreName.substring(0, 35) + '...'
                      : item.primaryGenreName}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#f2f2f2',
                    height: 1,
                    width: '100%',
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.trackId.toString()}
      />
    </View>
  );
}
