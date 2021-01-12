import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  // state
  const [movieName, setMovieName] = useState('')
  const [review, setReview] = useState('')
  const [movieReviewList, setMovieList] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/api/get')
    .then((response) => {
      setMovieList(response.data)
      console.log(response.data)
    })
  }, [])


  
  const submitReview = () => {
    axios.post('http://localhost:3001/api/insert', 
    {
      movieName: movieName, 
      movieReview: review
    }).then(() => {
      alert('データの挿入に成功しました。')
    })
  }
  
  return (
    <div className="App">
      <h1>
        Crud Application
      </h1>
      <div className="form">
        <label>案件のタイトル</label>
        <input type="text" name="movieName" onChange={(e) => {
          setMovieName(e.target.value)
        }}/>
        <label>タスク内容:</label>
        <input type="text" name="review" onChange={(e) => {
          setReview(e.target.value)
        }}/>
      </div> 

      <button onClick={submitReview}>Submit</button>
      {movieReviewList.map((value) => {
        return (
        <h3>案件のタイトル：{value.movieName} | タスクの内容: {value.movieReview}
        </h3>
        );
      })}
    </div>
  );
}

export default App;
