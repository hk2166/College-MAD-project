import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from "react-native";
import Voice from "@react-native-voice/voice";
import Tts from "react-native-tts";
import { askGemini } from "../api/gemini";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [textInput, setTextInput] = useState("");
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  useEffect(() => {
    // Initialize TTS
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    // Voice event handlers
    Voice.onSpeechStart = () => {
      console.log('Speech started');
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
    };

    Voice.onSpeechError = (error) => {
      console.error('Speech error:', error);
      setListening(false);
      setIsProcessing(false);
      Alert.alert('Speech Error', 'Could not process speech. Please try again.');
    };

    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setTranscript(event.value[0]);
        handleQuery(event.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setTranscript("");
    setResponse("");
    setListening(true);
    setIsProcessing(false);

    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error('Voice start error:', e);
      setListening(false);
      Alert.alert('Error', 'Could not start voice recognition. Please check permissions.');
    }
  };

  const handleQuery = async (query: string) => {
    setIsProcessing(true);
    setListening(false);
    
    try {
      const reply = await askGemini(query);
      setResponse(reply);
      Tts.speak(reply);
    } catch (error) {
      console.error('Query error:', error);
      setResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleQuery(textInput.trim());
      setTextInput("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, inputMode === 'voice' && styles.modeButtonActive]}
          onPress={() => setInputMode('voice')}
        >
          <Ionicons name="mic" size={16} color={inputMode === 'voice' ? '#fff' : '#666'} />
          <Text style={[styles.modeText, inputMode === 'voice' && styles.modeTextActive]}>Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, inputMode === 'text' && styles.modeButtonActive]}
          onPress={() => setInputMode('text')}
        >
          <Ionicons name="create" size={16} color={inputMode === 'text' ? '#fff' : '#666'} />
          <Text style={[styles.modeText, inputMode === 'text' && styles.modeTextActive]}>Text</Text>
        </TouchableOpacity>
      </View>

      {/* Voice Input */}
      {inputMode === 'voice' && (
        <TouchableOpacity
          style={[
            styles.actionButton, 
            listening && styles.actionButtonListening,
            isProcessing && styles.actionButtonProcessing
          ]}
          onPress={startListening}
          disabled={listening || isProcessing}
          activeOpacity={0.8}
        >
          {listening ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.actionText}>Listening...</Text>
            </View>
          ) : isProcessing ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.actionText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="mic" size={20} color="#fff" />
              <Text style={styles.actionText}>Tap to Ask</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Text Input */}
      {inputMode === 'text' && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about cooking, recipes, ingredients..."
            value={textInput}
            onChangeText={setTextInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.submitButton, !textInput.trim() && styles.submitButtonDisabled]}
            onPress={handleTextSubmit}
            disabled={!textInput.trim() || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Transcript */}
      {transcript?.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={16} color="#007AFF" />
            <Text style={styles.cardLabel}>You said</Text>
          </View>
          <Text style={styles.cardText}>{transcript}</Text>
        </View>
      )}

      {/* Response */}
      {response?.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="restaurant" size={16} color="#34C759" />
            <Text style={styles.cardLabel}>Cooking Assistant</Text>
          </View>
          <Text style={styles.cardText}>{response}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: "#FF6B35",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modeTextActive: {
    color: "#fff",
  },
  actionButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonListening: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
  actionButtonProcessing: {
    backgroundColor: "#FF9500",
    shadowColor: "#FF9500",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minHeight: 50,
    maxHeight: 120,
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#C7C7CC",
    shadowColor: "#C7C7CC",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});
