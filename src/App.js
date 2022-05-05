import { useEffect, useState } from 'react';
import './App.css';
import { useRestraunts } from './utils/useRestraunts';
import { useReveiws } from './utils/useReviews';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import React from 'react';
import { RestrauntOverView } from './utils/RestrauntOverview';

class Resturant {
  id;
  address;
  name;
  phoneNumber;
  url;
  ratingTotal;
  ratingCount;
}

class ReviewObj {
  restrauntId;
  title;
  rating;
  description;
  date;
}

function App() {
  const [restraunts, addRestraunt, updateRestraunt, getRestrauntById] = useRestraunts();
  const [reviews, addReview] = useReveiws();
  const [user, setUser] = useState(null)
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [pois, setPois] = useState([]);
  const [currPoi, setCurrPoi] = useState(null);
  const [restrauntOpen, setRestrauntOpen] = useState(false);
  const [selectedRestraunt, setSelectedRestraunt] = useState(null);
  const [newReviewOpen, setNewReviewOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");

  // TODO: add ui that lets users review a saved resturant

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    navigator.geolocation.getCurrentPosition(
      (location) => {
        setUserLocation(location.coords);
      }, 
      (err) => {
        console.log('error: ' + err);
      },
    );
  }, []);

  useEffect(() => {
    if (userLocation !== null) {
      getResturants();
    }
  }, [userLocation]);

  const getResturants = async () => {
    // console.log(userLocation);
    const apiKey = 'ANTOMpRKPlILmYg6LB18kSTiAA4RGUts';
    const radius = 5000;
    // https://api.tomtom.com/search/2/poiSearch/restaurant.json?key={Your_API_Key}&lat={lat}&lon={lon}&radius={radius}&categoryset={categoryset}nPowerKW}&maxpowerkw={maxpowerkw}
    const response = await fetch(`https://api.tomtom.com/search/2/poiSearch/restaurant.json?key=${apiKey}&lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=${radius}&categorySet=7315&view=Unified&relatedPois=off&key=*****`);
    const { results } = await response.json();

    let list = [];
    for (let i = 0; i < results.length; i++) {
      list.push(jsonToRestraunt(results[i]));
    }
    list = shuffle(list); // TODO: add this back
    // console.log('list: ', list);
    let temp = list.pop();
    // console.log('temp: ', temp);
    if (temp !== null) {
      getRestrauntById(temp.id);
    }
    setCurrPoi(temp);
    setPois(list);
  }

  const jsonToRestraunt = (obj) => {
    // console.log('obj: ', obj);
    let newRestraunt = new Resturant();
    newRestraunt.id = obj.id;
    newRestraunt.address = obj.address.freeformAddress;
    newRestraunt.name = obj.poi.name;
    newRestraunt.phoneNumber = obj.poi.phone;
    newRestraunt.url = obj.poi.url;
    newRestraunt.ratingTotal = 0;
    newRestraunt.ratingCount = 0;
    // console.log('newRestraunt: ', newRestraunt);

    return newRestraunt;
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



  const signIn = async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, userEmail, userPassword);

  }

  const signUp = async () => {
    const auth = getAuth();
    // console.log(userEmail);
    // console.log(userPassword);
    await createUserWithEmailAndPassword(auth, userEmail, userPassword);
  }

  const logout = async () => {
    const auth = getAuth();
    signOut(auth);
  }

  const goToPoi = async () => {
    addRestraunt(currPoi);
  }

  const nextPoi = async () => {
    // console.log('starting nextPoi: ----');
    // console.log('pois:', pois);
    // console.log(pois.length !== 0);
    if (pois.length !== 0) {
      let copyPois = pois;
      let temp = copyPois.pop();
      // console.log('temp: ', temp)
      const fsq = await getRestrauntById(temp.id);
      // console.log('fsq: ', fsq);
      if (fsq !== null ) {
        setCurrPoi(fsq);
      }else {
        setCurrPoi(temp);
      }
      setPois(copyPois);
    } else {
      setCurrPoi(null);
    }
    // console.log('currPoi', currPoi);
    // console.log('------------------------------\n');
  }

  const goToReviews = (restraunt) => {
    setRestrauntOpen(true);
    setSelectedRestraunt(restraunt);
  }

  const saveNewReview = (title, rating, description) => {
    // console.log('saveNewReview started -----');
    // console.log('selectedRestraunt: ', selectedRestraunt);
    const review = new ReviewObj();
    review.restrauntId = selectedRestraunt.id;
    review.title = title;
    review.rating = rating;
    review.description = description;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    review.date = mm + '/' + dd + '/' + yyyy;

    addReview(review);

    setNewReviewOpen(false);
    setRestrauntOpen(true);

    let restrauntUpdate = selectedRestraunt;
    console.log(parseInt(rating));
    restrauntUpdate.ratingCount += 1;
    restrauntUpdate.ratingTotal += parseInt(rating);
    updateRestraunt(restrauntUpdate);

  }

  return (
    <div className='App'>
      {/* user is not logged in */}
      { 
          !user && (
            <div className='loginContainer'>
              <div>Email</div>
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
        
              <div>Password</div>
              <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
              
              <div>
                <button type='button' onClick={signIn}>Sign In</button>
                <button type='button' onClick={signUp}>Sign Up</button>
              </div>
            </div>
          )
      }


      {/* user is logged in */}
      {
        user && (
          <div className='uiContainer'>
            <div className='left'>
              <button className='signoutButton' type='button' onClick={logout}>Sign out</button>
              <div>
                <RestrauntOverView restraunt={currPoi} goToPoi={goToPoi} nextPoi={nextPoi} goToReviews={goToReviews} />
              </div>

            </div>



            <div className='right'>
              {
                (restrauntOpen === false) && (
                  
                  <div>
                    <h1> Restraunts that our users have been to</h1>
                    <h3> Click on one to see our users reviews!</h3>
                    <div>
                      {restraunts.map((restraunt) => {
                        return (
                          <div className="restraunt" key={restraunt.id} onClick={() => {
                            goToReviews(restraunt);
                            }}> {restraunt.name} 
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              }

              {
                restrauntOpen === true && (
                  <div>
                    <h1>{selectedRestraunt.name} reviews</h1>                  
                    <button onClick={() => {
                      setRestrauntOpen(false);
                      setSelectedRestraunt(null);
                    }}>Back</button>


                    {/*new review not open */
                      newReviewOpen === false && (
                        <div className='reviewContainer'>
                          {reviews.map((review) => {
                            if (parseInt(review.restrauntId) - selectedRestraunt.id === 0) {
                              // console.log('matched', review);
                              return (
                                <div key={review.id}>
                                  <div className="reviewTitleRating">
                                    <h3>{review.title} ------ </h3>
                                    <h3>{review.rating} Stars</h3>
                                  </div>
                                    
                                  <h4>{review.description}</h4>
                                  <h4>{review.date}</h4>
                                </div>
                              );
                            }
                            
                          })}
                          <button onClick={() => {
                            // console.log('new review button pressed');
                            setNewReviewOpen(true);
                          }}>Leave a new review</button>
                        </div>
                      )
                    }
                    {/*new review open */
                      newReviewOpen === true && (
                        <div>
                          <div>Title</div>
                          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

                          <div>Rating (from 1 to 5)</div>
                          <input type="number" value={rating} onChange={(e) => setRating(e.target.value)}/>

                          <div>Description</div>
                          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>

                          <button onClick={() => {
                            saveNewReview(title, rating, description)}
                            }>Save</button>
                        </div>
                      )
                    }
                    
                  </div>
                )
              }

              
            </div>
          </div>
        )
      }
    </div>
);
}

export default App;
