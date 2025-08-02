import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";

const UserListScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const allUsers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid !== currentUserId) {
          allUsers.push(data);
        }
      });
      setUsers(allUsers);
      setFiltered(allUsers);
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredUsers);
  };

  const capitalizeName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const openChat = (user) => {
    navigation.navigate("Chat", { receiver: user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a user to chat with</Text>

      <TextInput
        placeholder="Search users..."
        placeholderTextColor="#B0C4DE"
        value={search}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => openChat(item)}
          >
            <Text style={styles.userName}>
              {capitalizeName(item.name || "Unknown")}
            </Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A8C5E8",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2E5C99",
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#B8D2F0",
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    color: "#2E5C99",
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: "#6B94CA",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    color: "#E8F4FD",
    fontSize: 14,
  },
});

export default UserListScreen;
