import { useState } from 'react';

export const NewReview = ({ save }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");


  return (
    <div>
      <div>Title</div>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>

      <div>Rating</div>
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)}/>

      <div>Description</div>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
      <button onClick={save(title, rating, description)}>Save</button>
    </div>)
}