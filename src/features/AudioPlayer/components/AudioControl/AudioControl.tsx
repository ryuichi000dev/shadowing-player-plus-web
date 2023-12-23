import React, { useState } from 'react';

type AudioControlsProps = {
    onPlay: () => void;
    onStop: () => void;
    isPlaying: boolean;
};

export const AudioControls: React.FC<AudioControlsProps> = ({ onPlay, onStop, isPlaying }) => {
    return (
        <div>
            <button onClick={isPlaying ? onStop : onPlay}>
                {isPlaying ? 'Stop' : 'Play'}
            </button>
        </div>
    );
};
