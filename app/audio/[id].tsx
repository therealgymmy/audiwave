import React, { useEffect, useState } from 'react';
import { Button, View, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { podcastEpisodeAtom } from '@/components/podcastState';
import { ApplePodcastSearchResult } from '@/components/searchApplePodcast';

const AudioPlayer = () => {
  const { id } = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [podcastEpisode] = useAtom(podcastEpisodeAtom);

  const playSound = async () => {
    if (podcastEpisode.wrapperType !== 'podcastEpisode') {
      return;
    }

    console.log('Loading Sound');
    const url = podcastEpisode.episodeUrl;
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    setSound(sound);
    setIsPlaying(true);

    console.log('Playing:', url);
    await sound.playAsync();
  };

  const pauseSound = async () => {
    console.log('Pausing Sound');
    await sound?.pauseAsync();
    setIsPlaying(false);
  };

  const resumeSound = async () => {
    console.log('Resuming Sound');
    await sound?.playAsync();
    setIsPlaying(true);
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (id !== podcastEpisode.trackId.toString()) {
      console.log(
        'Err: Podcast episode mismatch! Expected:',
        id,
        'Actual:',
        podcastEpisode.trackId
      );
    }
  }, [id, podcastEpisode]);

  return (
    <View>
      {sound ? <></> : <Button title="Play" onPress={playSound} />}
      {sound ? (
        isPlaying ? (
          <Button title="Pause" onPress={pauseSound} />
        ) : (
          <Button title="Resume" onPress={resumeSound} />
        )
      ) : (
        <></>
      )}
      {podcastEpisode && podcastEpisode.wrapperType === 'podcastEpisode' ? (
        <Image
          source={{ uri: podcastEpisode.artworkUrl600 }}
          style={{ width: 300, height: 300 }}
        />
      ) : null}
    </View>
  );
};

export default AudioPlayer;
