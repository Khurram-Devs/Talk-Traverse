import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SUPPORTED_LANGUAGES, translateText } from '../services/translationService';

const TranslationModal = ({ 
  visible, 
  onClose, 
  message, 
  onTranslationComplete 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const filteredLanguages = Object.entries(SUPPORTED_LANGUAGES).filter(([code, name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleTranslate = async () => {
    if (!selectedLanguage) {
      Alert.alert('Error', 'Please select a language to translate to');
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const translated = await translateText(message.text, 'en', selectedLanguage);
      setTranslatedText(translated);
      
      if (onTranslationComplete) {
        onTranslationComplete({
          original: message.text,
          translated: translated,
          targetLanguage: selectedLanguage,
          targetLanguageName: SUPPORTED_LANGUAGES[selectedLanguage]
        });
      }
    } catch (error) {
      Alert.alert('Translation Error', error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClose = () => {
    setSelectedLanguage('');
    setSearchQuery('');
    setTranslatedText('');
    setIsTranslating(false);
    onClose();
  };

  const handleCopyTranslation = () => {
    Alert.alert('Success', 'Translation copied!');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Translate Message</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Original Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Original Message:</Text>
          <View style={styles.originalMessageBox}>
            <Text style={styles.originalMessageText}>{message?.text}</Text>
          </View>
        </View>

        {/* Language Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            placeholderTextColor="#B0C4DE"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Language List */}
        <Text style={styles.sectionTitle}>Select Target Language:</Text>
        <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
          {filteredLanguages.map(([code, name]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.languageItem,
                selectedLanguage === code && styles.selectedLanguageItem
              ]}
              onPress={() => handleLanguageSelect(code)}
            >
              <Text style={[
                styles.languageText,
                selectedLanguage === code && styles.selectedLanguageText
              ]}>
                {name}
              </Text>
              <Text style={[
                styles.languageCode,
                selectedLanguage === code && styles.selectedLanguageCode
              ]}>
                {code.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Translation Result */}
        {translatedText ? (
          <View style={styles.translationContainer}>
            <Text style={styles.translationLabel}>
              Translation ({SUPPORTED_LANGUAGES[selectedLanguage]}):
            </Text>
            <View style={styles.translationBox}>
              <Text style={styles.translationText}>{translatedText}</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={handleCopyTranslation}
              >
                <Text style={styles.copyButtonText}>📋 Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.translateButton]}
            onPress={handleTranslate}
            disabled={!selectedLanguage || isTranslating}
          >
            {isTranslating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>🌐 Translate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#A8C5E8',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#8BB6E8',
    borderBottomWidth: 1,
    borderBottomColor: '#7BA4D9',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7BA4D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 30,
  },
  messageContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5C99',
    marginBottom: 8,
  },
  originalMessageBox: {
    backgroundColor: '#B8D2F0',
    borderRadius: 10,
    padding: 15,
  },
  originalMessageText: {
    fontSize: 16,
    color: '#2E5C99',
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#B8D2F0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2E5C99',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5C99',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B8D2F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectedLanguageItem: {
    backgroundColor: '#6B94CA',
  },
  languageText: {
    fontSize: 16,
    color: '#2E5C99',
    flex: 1,
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: '600',
  },
  languageCode: {
    fontSize: 12,
    color: '#4A73A8',
    fontWeight: '500',
  },
  selectedLanguageCode: {
    color: '#E8F4FD',
  },
  translationContainer: {
    padding: 20,
    paddingTop: 10,
  },
  translationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5C99',
    marginBottom: 8,
  },
  translationBox: {
    backgroundColor: '#4A73A8',
    borderRadius: 10,
    padding: 15,
  },
  translationText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
    marginBottom: 10,
  },
  copyButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6B94CA',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    padding: 20,
    paddingTop: 10,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  translateButton: {
    backgroundColor: '#2E5C99',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TranslationModal;