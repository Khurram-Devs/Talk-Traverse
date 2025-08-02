import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../../firebase";
  
  export const getChatId = (userA, userB) => {
    return [userA, userB].sort().join("_");
  };
  
  export const sendMessageToFirestore = async (chatId, text, senderId) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text,
      senderId,
      timestamp: serverTimestamp(),
    });
  };
  
  export const subscribeToMessages = (chatId, callback) => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });
  
    return unsubscribe;
  };
  