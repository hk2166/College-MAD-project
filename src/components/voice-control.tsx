'use client';

import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { processVoiceCommand } from '@/ai/flows/control-app-with-voice-commands';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceControlProps {
  recipeName: string;
  currentStep: number; // 1-indexed
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  repeatStep: () => void;
  openSubstitutionModal: (ingredient: string) => void;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);

export function VoiceControl({
  recipeName,
  currentStep,
  goToNextStep,
  goToPreviousStep,
  goToStep,
  repeatStep,
  openSubstitutionModal,
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      try {
        const result = await processVoiceCommand({
          command,
          currentStep,
          recipeName,
        });

        switch (result.action) {
          case 'next_step':
            goToNextStep();
            break;
          case 'previous_step':
            goToPreviousStep();
            break;
          case 'go_to_step':
            if (result.data?.step && typeof result.data.step === 'number') {
              goToStep(result.data.step);
            }
            break;
          case 'substitute_ingredient':
            if (result.data?.ingredient && typeof result.data.ingredient === 'string') {
              openSubstitutionModal(result.data.ingredient);
            }
            break;
          case 'repeat_step':
            repeatStep();
            break;
          default:
            toast({ title: "Didn't catch that", description: 'Please try your voice command again.', variant: 'destructive' });
        }

        if (result.response) {
          toast({ title: 'Copilot', description: result.response });
        }
      } catch (error) {
        console.error('Error processing voice command:', error);
        toast({ title: 'Voice Error', description: "Couldn't process your command.", variant: 'destructive' });
      }
    },
    [currentStep, recipeName, goToNextStep, goToPreviousStep, goToStep, openSubstitutionModal, repeatStep, toast]
  );

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      toast({ title: 'Heard you!', description: `"${transcript}"` });
      handleCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast({ title: 'Voice Error', description: 'There was an issue with speech recognition.', variant: 'destructive' });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [handleCommand, toast]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({ title: 'Not Supported', description: 'Your browser does not support voice commands.' });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleListening}
      className={cn(
        'bg-background/70 hover:bg-background',
        isListening && 'bg-destructive/90 text-destructive-foreground animate-pulse'
      )}
    >
      {isListening ? <MicOff /> : <Mic />}
      <span className="sr-only">{isListening ? 'Stop Listening' : 'Start Listening'}</span>
    </Button>
  );
}
