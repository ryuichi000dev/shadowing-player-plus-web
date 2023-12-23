import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = (audioSrc: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedAudioRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number | null>(null);
    const recordedAudioUrlRef = useRef<string | null>(null);

    useEffect(() => {
        // 録音の準備
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = (event) => {
                        recordedAudioRef.current.push(event.data);
                    };
                });
        }
    
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current = null;
            }
        };
    }, []);


    useEffect(() => {
        // audioRef に HTMLAudioElement を設定
        audioRef.current = new Audio(audioSrc);
    
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
            startTimeRef.current = Date.now();
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            const duration = Date.now() - (startTimeRef.current || Date.now());
            startRecording(duration);
        }
    };


    const startRecording = (duration: number) => {
        if (mediaRecorderRef.current) {
            setIsRecording(true);
            recordedAudioRef.current = []; // 録音データのリセット
            mediaRecorderRef.current.start();
            
            setTimeout(() => {
                mediaRecorderRef.current?.stop();
                // 録音が停止したことを確認するために、stop イベントをリッスンします。
                mediaRecorderRef.current?.addEventListener('stop', () => {
                    playRecordedAudio();
                    setIsRecording(false);
                }, { once: true });
            }, duration);
        }
    };
    
    const playRecordedAudio = () => {
        if (recordedAudioRef.current.length > 0) {
            const recordedBlob = new Blob(recordedAudioRef.current, { type: 'audio/webm' });
            recordedAudioUrlRef.current = URL.createObjectURL(recordedBlob);
            const recordedAudio = new Audio(recordedAudioUrlRef.current);
            recordedAudio.play();
        }
    };
    
    return { play, stop, isPlaying, isRecording };
};
