import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim());

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!isValidName(name)) {
      Alert.alert("Invalid Name", "Name must only contain letters and spaces.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });
      console.log("User created:", user.uid);
      Alert.alert("Success", "Account created!");
      navigation.navigate("Users");
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Signup Failed", "Email is already in use.");
      } else {
        Alert.alert("Signup Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#B0C4DE"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#B0C4DE"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#B0C4DE"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A8C5E8",
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E5C99",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "#B8D2F0",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#2E5C99",
  },
  signupButton: {
    backgroundColor: "#4A73A8",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#2E5C99",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SignupScreen;
