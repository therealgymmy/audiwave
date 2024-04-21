import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { podcastEpisodeMetadataAtom } from '@/components/podcastState';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const AudioPlayer = () => {
  const { id } = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [podcastEpisodeMetadata] = useAtom(podcastEpisodeMetadataAtom);
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
    const newPositionMillis = value * (podcastEpisodeMetadata.durationMs || 1);
    await sound?.setPositionAsync(newPositionMillis);
    setCurrentPositionMillis(newPositionMillis);
  };

  const downloadAndCacheAudio = async () => {
    if (FileSystem.documentDirectory === null) {
      console.log('Download error: FileSystem.documentDirectory is null');
      return;
    }

    const uri = podcastEpisodeMetadata.audioUrl;
    const filename = uri.split('/').pop();
    const fileUri = FileSystem.documentDirectory + filename;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      console.log('Audio already cached at', fileInfo.uri);
      return;
    }

    console.log('Downloading and caching audio');

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        console.log(
          `Downloading progress: ${Math.round(progress * 100)}% == ${
            downloadProgress.totalBytesWritten
          } / ${downloadProgress.totalBytesExpectedToWrite}`
        );
        // Update your UI or state with the download progress here
      }
    );

    try {
      await downloadResumable
        .downloadAsync()
        .then((uri) => {
          console.log('Finished downloading to', uri);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error('Error downloading or caching audio', error);
    }
  };

  const loadSound = async () => {
    console.log('Checking for cached audio');
    if (FileSystem.documentDirectory === null) {
      console.log('Load error: FileSystem.documentDirectory is null');
      return;
    }
    const filename = podcastEpisodeMetadata.audioUrl.split('/').pop();
    const fileUri = FileSystem.documentDirectory + filename;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    let source = { uri: podcastEpisodeMetadata.audioUrl }; // Default to loading from URL
    if (fileInfo.exists) {
      source = { uri: fileInfo.uri }; // If cached, load from the local file system
    }
    console.log('Loading audio:', source.uri);

    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
    });

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    setSound(sound);
    setIsPlaying(true);

    console.log('Playing:', source.uri);
    await sound.playAsync();
  };

  useEffect(() => {
    loadSound();
  }, [id, podcastEpisodeMetadata]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: podcastEpisodeMetadata.artworkUrl }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.trackTitle}>{podcastEpisodeMetadata.title}</Text>
        <Text style={styles.artist}>{podcastEpisodeMetadata.artistName}</Text>
        <Text style={styles.description}>
          {podcastEpisodeMetadata.description}
        </Text>
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
                currentPositionMillis / (podcastEpisodeMetadata.durationMs || 1)
              }
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          ) : (
            <></>
          )}
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadAndCacheAudio}
        >
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
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
  description: {
    fontSize: 14,
    color: 'white',
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
  downloadButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AudioPlayer;
