import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  getChatId,
  sendMessageToFirestore,
  subscribeToMessages,
} from "../services/firestoreService";
import AppLayout from "../layout/AppLayout";
import TranslationModal from "../components/TranslationModal";
import { speakText, translateAndSpeak } from "../services";

const ReceiverProfile = ({ receiverName }) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.profileImage}>
        <View style={styles.profileImageInner} />
      </View>
      <Text style={styles.receiverName}>{receiverName}</Text>
    </View>
  );
};

const ActionButton = ({
  title,
  onPress,
  type = "secondary",
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        type === "primary"
          ? styles.actionButtonPrimary
          : styles.actionButtonSecondary,
        disabled && styles.actionButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.actionButtonText,
          type === "primary"
            ? styles.actionButtonTextPrimary
            : styles.actionButtonTextSecondary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const MessageBubble = ({
  message,
  isReceived,
  onTranslate,
  onListen,
  onUpdateMessage,
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showingOriginal, setShowingOriginal] = useState(true);

  const hasTranslation = message.translation && message.translation.text;

  const handleTranslate = () => {
    setIsTranslating(true);
    setShowTranslationModal(true);
  };

  const handleTranslationComplete = (translationData) => {
    setIsTranslating(false);
    setShowTranslationModal(false);
    setShowingOriginal(false);

    const updatedMessage = {
      ...message,
      translation: {
        text: translationData.translated,
        language: translationData.targetLanguage,
        languageName: translationData.targetLanguageName,
      },
    };

    if (onUpdateMessage) {
      onUpdateMessage(updatedMessage);
    }

    if (onTranslate) {
      onTranslate(translationData);
    }
  };

  const handleTranslationCancel = () => {
    setIsTranslating(false);
    setShowTranslationModal(false);
  };

  const toggleTextView = () => {
    if (hasTranslation) {
      setShowingOriginal(!showingOriginal);
    }
  };

  const handleListen = async () => {
    if (isSpeaking) return;

    setIsSpeaking(true);

    try {
      let textToSpeak = message.text;
      let languageCode = "en";

      if (hasTranslation && !showingOriginal) {
        textToSpeak = message.translation.text;
        languageCode = message.translation.language;

        try {
          await translateAndSpeak(message.text, "en", languageCode);
        } catch (fallbackError) {
          console.warn(
            "translateAndSpeak failed, falling back to speakText:",
            fallbackError
          );
          await speakText(textToSpeak, { language: languageCode, rate: 0.8 });
        }
      } else {
        await speakText(textToSpeak, { language: "en", rate: 0.8 });
      }

      if (onListen) {
        await onListen({
          ...message,
          currentText: textToSpeak,
          currentLanguage: languageCode,
        });
      }
    } catch (error) {
      console.error("Error speaking text:", error);
    } finally {
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
    }
  };

  const displayText =
    hasTranslation && !showingOriginal
      ? message.translation.text
      : message.text;

  const getToggleButtonText = () => {
    if (isTranslating) return "Translating...";
    if (!hasTranslation || showingOriginal) return "Translate";
    return showingOriginal ? "Show Translation" : "Show Original";
  };

  return (
    <>
      <View
        style={[
          styles.messageBubbleContainer,
          isReceived
            ? styles.receivedMessageContainer
            : styles.sentMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isReceived ? styles.receivedMessage : styles.sentMessage,
          ]}
        >
          {/* Language Indicator */}
          {hasTranslation && (
            <View style={styles.languageIndicator}>
              <Text style={styles.languageIndicatorText}>
                {showingOriginal ? "English" : message.translation.languageName}
              </Text>
            </View>
          )}

          {/* Message Text */}
          <Text
            style={[
              styles.messageText,
              isReceived ? styles.receivedMessageText : styles.sentMessageText,
              !showingOriginal && styles.translatedText,
            ]}
          >
            {displayText}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <ActionButton
              title={getToggleButtonText()}
              onPress={handleTranslate}
              type="secondary"
              disabled={isTranslating || isSpeaking}
            />
            <ActionButton
              title={isSpeaking ? "Playing" : "Listen"}
              onPress={handleListen}
              type="secondary"
              disabled={isTranslating || isSpeaking}
            />
          </View>
        </View>
      </View>

      <TranslationModal
        visible={showTranslationModal}
        onClose={handleTranslationCancel}
        message={message}
        onTranslationComplete={handleTranslationComplete}
      />
    </>
  );
};

const MessageInput = ({ value, onChangeText, onSend }) => {
  const handleSend = () => {
    if (value && value.trim()) {
      onSend();
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === "Enter" && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Type Message..."
        placeholderTextColor="#B0C4DE"
        value={value}
        onChangeText={onChangeText}
        multiline
        returnKeyType="send"
        onSubmitEditing={handleSend}
        onKeyPress={handleKeyPress}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!value || !value.trim()) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!value || !value.trim()}
      >
        <Text style={styles.sendButtonText}>↑</Text>
      </TouchableOpacity>
    </View>
  );
};

const MessagesList = ({ messages, onTranslate, onListen, onUpdateMessage }) => {
  const scrollViewRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.messagesContainer}
      contentContainerStyle={styles.messagesContent}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          message={message}
          isReceived={message.isReceived}
          onTranslate={onTranslate}
          onListen={onListen}
          onUpdateMessage={onUpdateMessage}
        />
      ))}
    </ScrollView>
  );
};

const ChatScreen = () => {
  const [translationHistory, setTranslationHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const senderId = "user1";
  const receiverId = "user2";
  const chatId = getChatId(senderId, receiverId);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, (fetchedMessages) => {
      const formatted = fetchedMessages.map((msg) => ({
        ...msg,
        isReceived: msg.senderId !== senderId,
      }));
      setMessages(formatted);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      await sendMessageToFirestore(chatId, inputText.trim(), senderId);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUpdateMessage = (updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
  };

  const handleTranslate = (translationData) => {
    setTranslationHistory((prev) => [
      ...prev,
      {
        ...translationData,
        timestamp: new Date().toISOString(),
      },
    ]);

    console.log("Translation completed:", translationData);
  };

  const handleListen = async (messageData) => {
    try {
      console.log(
        "Listening to:",
        messageData.currentText,
        "in",
        messageData.currentLanguage
      );
    } catch (error) {
      console.error("Error in listen handler:", error);
    }
  };

  const headerConfig = {
    showBackButton: true,
    showMenuButton: true,
    centerContent: <ReceiverProfile receiverName="Receiver" />,
    onBackPress: () => {
      console.log("Back from chat");
    },
  };

  return (
    <AppLayout headerConfig={headerConfig}>
      <StatusBar backgroundColor="#8BB6E8" barStyle="light-content" />

      <MessagesList
        messages={messages}
        onTranslate={handleTranslate}
        onListen={handleListen}
        onUpdateMessage={handleUpdateMessage}
      />

      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
      />
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6B94CA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  profileImageInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4A73A8",
  },
  receiverName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },

  messageBubbleContainer: {
    marginVertical: 5,
  },
  receivedMessageContainer: {
    alignItems: "flex-start",
  },
  sentMessageContainer: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "85%",
    borderRadius: 20,
    padding: 15,
    minWidth: 120,
  },
  receivedMessage: {
    backgroundColor: "#4A73A8",
  },
  sentMessage: {
    backgroundColor: "#6B94CA",
  },

  languageIndicator: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  languageIndicatorText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10,
  },
  translatedText: {
    fontStyle: "italic",
  },
  receivedMessageText: {
    color: "white",
  },
  sentMessageText: {
    color: "white",
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
  },
  actionButtonPrimary: {
    backgroundColor: "#2E5C99",
  },
  actionButtonSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  actionButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  actionButtonTextPrimary: {
    color: "white",
  },
  actionButtonTextSecondary: {
    color: "white",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#A8C5E8",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#B8D2F0",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E5C99",
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A73A8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#8BB6E8",
  },
  sendButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatScreen;
