export const RestrauntOverView = ({ restraunt, goToPoi, nextPoi, goToReviews }) => {
  // console.log('restraunt: ', restraunt);

  if (restraunt === null || restraunt === undefined) {
    return (
      <h1>Sorry, there are no more restaurants in your area.</h1>
    )
  }


  return (
    <div>
      <h1>{restraunt.name}</h1>
      <h4>{restraunt.address}</h4>
      {
        restraunt.phoneNumber !== undefined && (
          <h4>Call: {restraunt.phoneNumber}</h4>
        )
      }
      {
        (restraunt.url !== undefined  || restraunt.url) === null && (
          <h4>Visit: {restraunt.url}</h4>
        )
      }
      {
        restraunt.ratingCount !== 0 && (
          <div>
            <h4>User Rating: {restraunt.ratingTotal/restraunt.ratingCount} star(s)</h4>
            <button onClick={goToReviews}>Look at our users reviews</button>
          </div>
        )
      }
      
      { 
        restraunt.ratingCount === 0 && (
        <h4> Be the first user to visit and review!</h4>
        )
      }
      <div>
        <button onClick={goToPoi}>Im going to go!</button>
        <button onClick={nextPoi}>Next</button>
      </div>
    </div>
  );
}

// class Resturant {
//   id;
//   address;
//   name;
//   phoneNumber;
//   url;
//   ratingTotal;
//   ratingCount;
// }