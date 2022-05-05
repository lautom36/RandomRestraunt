import { useEffect, useState, useRef } from "react";
import { doc, addDoc, collection, onSnapshot, setDoc, getFirestore, query, where, QuerySnapshot } from "firebase/firestore";
export const useRestraunts = () => {
  const [restraunts, setRestraunts] = useState([]);
  const restrauntRef = useRef([]);
  
  useEffect( () => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(collection(db, "restraunts"), (snapshot) => {
        snapshot.docChanges().forEach((change) =>{
          if (change.type === 'added') {
            restrauntRef.current.push({id: change.doc.id, ...change.doc.data() });
          }
          if (change.type === 'modified') {
            const index = restrauntRef.current.findIndex((restraunt) => restraunt.id === change.doc.id);
            restrauntRef.current[index] = {id: change.doc.id, ...change.doc.data() };
          }
        });
        setRestraunts([...restrauntRef.current]);
    });
    return unsubscribe;
  }, []);

  const addRestraunt = async (restaurant) => {
    if (restaurant.url === undefined) {
      restaurant.url = null;
    }
    const db = getFirestore();
    await setDoc(doc(db, 'restraunts', restaurant.id), {
      id: restaurant.id,
      address: restaurant.address,
      name: restaurant.name,
      phoneNumber: restaurant.phoneNumber,
      url: restaurant.url,
      ratingTotal: restaurant.ratingTotal,
      ratingCount: restaurant.ratingCount,
    });
  }

  const updateRestraunt = (restraunt) => {
    console.log('starting updateRestraunt: ----');
    console.log(restraunt);
    console.log(restraunts);
    const db = getFirestore();
    setDoc(doc(db, "restraunts", restraunt.id), {
      ratingTotal: restraunt.ratingTotal,
      ratingCount: restraunt.ratingCount
    }, { merge: true});
  }

  const getRestrauntById = async (id) => {
    // console.log('starting getRestrauntById: ----');
    // console.log('id: ', id);
    if ( id !== null) {
      for (let i of restraunts) {
        // console.log('i: ', i);
        if (i.id === id) {
          return i;
        }
      }
      // console.log('asdfsadfasf', restraunts);
    }
    
    return null;
  }

  return [restraunts, addRestraunt, updateRestraunt, getRestrauntById];
}

class Resturant {
  id;
  address;
  name;
  phoneNumber;
  url;
  ratingTotal;
  ratingCount;
}