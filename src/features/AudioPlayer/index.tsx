import React from 'react';
import { AudioControls } from './components/AudioControl/AudioControl';
import { useAudioPlayer } from './hooks/useAudioPlayer';

export const AudioPlayer = () => {
    const audioSrc = './audiomaterial/curry.mp3';
    const { play, stop, isPlaying } = useAudioPlayer(audioSrc);

    return (
        <div>
            <AudioControls onPlay={play} onStop={stop} isPlaying={isPlaying} />
            {/* 他のコンポーネントもここに追加します。 */}
        </div>
    );
};
