import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { podcastEpisodeAtom } from '@/components/podcastState';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const AudioPlayer = () => {
  const { id } = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [podcastEpisode] = useAtom(podcastEpisodeAtom);
  const [currentPositionMillis, setCurrentPositionMillis] = useState(0);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }

    setCurrentPositionMillis(status.positionMillis);
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

  const skipForward = async () => {
    await sound?.setPositionAsync(currentPositionMillis + 30000);
  };

  const skipBackward = async () => {
    await sound?.setPositionAsync(Math.max(currentPositionMillis - 15000, 0));
  };

  const handleSliderChange = async (value: number) => {
    const newPositionMillis = value * (podcastEpisode.trackTimeMillis || 1);
    await sound?.setPositionAsync(newPositionMillis);
    setCurrentPositionMillis(newPositionMillis);
  };

  useEffect(() => {
    const loadSound = async () => {
      if (podcastEpisode.wrapperType !== 'podcastEpisode') {
        return;
      }

      console.log('Loading Sound');
      const url = podcastEpisode.episodeUrl;
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      setSound(sound);
      setIsPlaying(true);

      console.log('Playing:', url);
      await sound.playAsync();
    };
    loadSound();
  }, [id]);

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
    <View style={styles.container}>
      <Image
        source={{ uri: podcastEpisode.artworkUrl600 }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.trackTitle}>{podcastEpisode.trackName}</Text>
        <Text style={styles.artist}>{'TODO: placeholder'}</Text>
        <View style={styles.controls}>
          {!sound ? (
            <FontAwesome name="dot-circle-o" size={70} color="white" />
          ) : isPlaying ? (
            <>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={skipBackward}
              >
                <FontAwesome name="backward" size={70} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={pauseSound}
              >
                <FontAwesome name="pause-circle" size={70} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={skipForward}
              >
                <FontAwesome name="forward" size={70} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={skipBackward}
              >
                <FontAwesome name="backward" size={70} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={resumeSound}
              >
                <FontAwesome name="play-circle" size={70} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={skipForward}
              >
                <FontAwesome name="forward" size={70} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View>
          {sound ? (
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={
                currentPositionMillis / (podcastEpisode.trackTimeMillis || 1)
              }
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image covers the whole screen
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  artist: {
    fontSize: 18,
    color: 'white',
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  controlButton: {
    marginHorizontal: 16,
  },
});

export default AudioPlayer;
