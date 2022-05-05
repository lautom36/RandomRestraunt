export const Review = ({ review }) => {
  console.log('Review: ', review);
  // title --- rating
  // content
  // time submitted

  return (
    <div>
      <h3>{review.title}</h3>
      <h4>{review.description}</h4>
      <h4>{review.date}</h4>
    </div>
  )
}