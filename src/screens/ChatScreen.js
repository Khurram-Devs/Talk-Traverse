import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Header Component
const ChatHeader = ({ onBackPress, receiverName }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.profileSection}>
        <View style={styles.profileImage}>
          <View style={styles.profileImageInner} />
        </View>
        <Text style={styles.receiverName}>{receiverName}</Text>
      </View>

      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuButtonText}>≡</Text>
      </TouchableOpacity>
    </View>
  );
};

// Action Button Component (Translate/Listen)
const ActionButton = ({ title, onPress, type = "secondary" }) => {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        type === "primary"
          ? styles.actionButtonPrimary
          : styles.actionButtonSecondary,
      ]}
      onPress={onPress}
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

// Message Bubble Component
const MessageBubble = ({ message, isReceived, onTranslate, onListen }) => {
  return (
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
        <Text
          style={[
            styles.messageText,
            isReceived ? styles.receivedMessageText : styles.sentMessageText,
          ]}
        >
          {message.text}
        </Text>

        <View style={styles.actionButtonsContainer}>
          <ActionButton
            title="Translate"
            onPress={() => onTranslate(message)}
            type="secondary"
          />
          <ActionButton
            title="Listen"
            onPress={() => onListen(message)}
            type="secondary"
          />
        </View>
      </View>
    </View>
  );
};

// Message Input Component
const MessageInput = ({ value, onChangeText, onSend }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Type Message..."
        placeholderTextColor="#B0C4DE"
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Text style={styles.sendButtonText}>↑</Text>
      </TouchableOpacity>
    </View>
  );
};

// Messages List Component
const MessagesList = ({ messages, onTranslate, onListen }) => {
  return (
    <ScrollView
      style={styles.messagesContainer}
      contentContainerStyle={styles.messagesContent}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          isReceived={message.isReceived}
          onTranslate={onTranslate}
          onListen={onListen}
        />
      ))}
    </ScrollView>
  );
};

// Main Chat Screen Component
const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { text: "message 1", isReceived: false, id: 1 },
    { text: "message 2", isReceived: false, id: 2 },
    { text: "message 3", isReceived: false, id: 2 },
    { text: "message 4", isReceived: false, id: 2 },
    { text: "message 5", isReceived: false, id: 2 },
    { text: "message 6", isReceived: true, id: 3 },
    { text: "message 7", isReceived: false, id: 2 },
    { text: "message 8", isReceived: true, id: 3 },
    { text: "message 9", isReceived: true, id: 3 },
    { text: "message 10", isReceived: false, id: 2 },
    { text: "message 11", isReceived: true, id: 3 },
    { text: "message 12", isReceived: false, id: 2 },
    { text: "message 13", isReceived: true, id: 3 },
    { text: "message 14", isReceived: false, id: 2 },
    { text: "message 15", isReceived: true, id: 3 },
    { text: "message 16", isReceived: false, id: 2 },
    { text: "message 17", isReceived: true, id: 4 },
    { text: "message 18", isReceived: true, id: 4 },
  ]);

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        text: inputText,
        isReceived: false,
        id: messages.length + 1,
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const handleTranslate = (message) => {
    console.log("Translate:", message.text);
    // Implement translation logic
  };

  const handleListen = (message) => {
    console.log("Listen:", message.text);
    // Implement text-to-speech logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8BB6E8" barStyle="light-content" />

      <ChatHeader onBackPress={handleBackPress} receiverName="Receiver" />

      <MessagesList
        messages={messages}
        onTranslate={handleTranslate}
        onListen={handleListen}
      />

      <MessageInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8C5E8",
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#8BB6E8",
    borderRadius: 25,
    marginHorizontal: 10,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7BA4D9",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    flex: 1,
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7BA4D9",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
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
    maxWidth: "80%",
    borderRadius: 20,
    padding: 15,
  },
  receivedMessage: {
    backgroundColor: "#4A73A8",
  },
  sentMessage: {
    backgroundColor: "#6B94CA",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  receivedMessageText: {
    color: "white",
  },
  sentMessageText: {
    color: "white",
  },

  // Action Buttons Styles
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 3,
  },
  actionButtonPrimary: {
    backgroundColor: "#2E5C99",
  },
  actionButtonSecondary: {
    backgroundColor: "#5A84BB",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
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
  sendButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default ChatScreen;
