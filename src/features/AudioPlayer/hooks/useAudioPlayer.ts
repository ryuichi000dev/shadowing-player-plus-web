import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = (audioSrc: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // audioRef に HTMLAudioElement を設定
        audioRef.current = new Audio(audioSrc);

        // クリーンアップ関数
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioSrc]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return { play, stop, isPlaying };
};
