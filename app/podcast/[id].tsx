import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  ApplePodcastSearchResult,
  searchMostRecentEpisodesForPodcast,
} from '@/components/searchApplePodcast';

const Podcast = () => {
  const { id } = useLocalSearchParams();
  const [episodes, setEpisodes] = useState<ApplePodcastSearchResult[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await searchMostRecentEpisodesForPodcast(
        parseInt(id as string),
        20
      );
      return response;
    };
    fetchEpisodes().then((response) => setEpisodes(response));
  }, []);

  const renderItem = ({ item }: { item: ApplePodcastSearchResult }) => {
    return item.wrapperType === 'podcastEpisode' ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => Alert.alert('Url: ', item.episodeUrl)}
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
            source={{ uri: item.artworkUrl600 }}
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
    ) : (
      <></>
    );
  };

  return (
    <View>
      <FlatList
        data={episodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.trackId.toString()}
      />
    </View>
  );
};

export default Podcast;
