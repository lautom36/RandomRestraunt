import { useEffect, useState, useRef } from "react";
import { addDoc, collection, onSnapshot, getFirestore, query, where } from "firebase/firestore";
export const useReveiws = () => {
  const [reviews, setReviews] = useState([]);
  const reviewRef = useRef([]);
  
  useEffect( () => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
        snapshot.docChanges().forEach((change) =>{
          if (change.type === 'added') {
            reviewRef.current.push({id: change.doc.id, ...change.doc.data() });
          }
          if (change.type === 'modified') {
            const index = reviewRef.current.findIndex((review) => review.id === change.doc.id);
            reviewRef.current[index] = {id: change.doc.id, ...change.doc.data() };
          }
        });
        setReviews([...reviewRef.current]);
    });
    return unsubscribe;
  }, []);

  const addReview = async (review) => {
    const db = getFirestore();
    await addDoc(collection(db, 'reviews'), {
      restrauntId: review.restrauntId,
      title: review.title,
      rating: review.rating,
      description: review.description,
      date: review.date
    });
  }


  const getReviewsByRestrauntId = async (id) => {
    if ( id !== null) {
      const db = getFirestore();
      const q = query(collection(db, "reviews"), where("restrauntId", "==", id));
      onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
        });
      });
      return reviews[0];
    }
    
    return null;
  }

  return [reviews, addReview, getReviewsByRestrauntId];
}

class Review {
  restrauntId;
  title;
  rating;
  description;
  date;
}