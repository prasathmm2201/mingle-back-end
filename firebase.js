// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
const firebaseConfig = {
      apiKey: "AIzaSyAiez-iVwbjWRYm3jVcxJ23EpF0sjoT9fM",
      authDomain: "prasath-new.firebaseapp.com",
      projectId: "prasath-new",
      storageBucket: "prasath-new.appspot.com",
      messagingSenderId: "635340038428",
      appId: "1:635340038428:web:a25eb37d55f2e01baa9ad9",
      measurementId: "G-THTDY4RFN0"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export { storage, ref, getDownloadURL, uploadBytesResumable };
