import React, { useEffect, useState } from 'react';
import { FlatList, Text, Image, View, TouchableOpacity } from 'react-native';
import {
  ApplePodcastSearchResult,
  fetchPodcasts,
} from '@/components/searchApplePodcast';
import { useRouter } from 'expo-router';

export default function Feed() {
  const [episodes, setEpisodes] = useState<ApplePodcastSearchResult[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await fetchPodcasts(20);
      setEpisodes(response);
    };
    fetchEpisodes();
  }, []);

  const router = useRouter();
  const navigateToPodcast = (id: number) => {
    router.push(`/podcast/${id}`);
  };

  const renderItem = ({ item }: { item: ApplePodcastSearchResult }) => {
    return item.wrapperType === 'track' ? (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigateToPodcast(item.collectionId)}
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
}
