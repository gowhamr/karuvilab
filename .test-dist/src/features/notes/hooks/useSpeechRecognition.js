import { useState, useEffect, useCallback, useRef } from 'react';
export function useSpeechRecognition(onResult) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [recognition, setRecognition] = useState(null);
    const onResultRef = useRef(onResult);
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();
                recognitionInstance.continuous = true;
                recognitionInstance.interimResults = true;
                recognitionInstance.onresult = (event) => {
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript + ' ';
                        }
                    }
                    if (finalTranscript) {
                        onResultRef.current(finalTranscript);
                    }
                };
                recognitionInstance.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                    setError(event.error);
                    setIsListening(false);
                };
                recognitionInstance.onend = () => {
                    setIsListening(false);
                };
                Promise.resolve().then(() => {
                    setRecognition(recognitionInstance);
                });
            }
            else {
                Promise.resolve().then(() => {
                    setError('Speech recognition not supported in this browser.');
                });
            }
        }
    }, []);
    const toggleListening = useCallback(() => {
        if (!recognition)
            return;
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        }
        else {
            setError(null);
            try {
                recognition.start();
                setIsListening(true);
            }
            catch (err) {
                console.error(err);
            }
        }
    }, [recognition, isListening]);
    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);
    return { isListening, error, toggleListening, stopListening, isSupported: !!recognition };
}
