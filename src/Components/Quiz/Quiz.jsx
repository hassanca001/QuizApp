import React, { useRef, useState } from 'react';
import { data } from '../../assets/data'; // Make sure to have this data file in the correct path

const Quiz = () => {
  // State for user details
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    idNumber: '',
    userClass: '',
    submitted: false
  });

  // State for quiz data
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Refs for options to handle correct and incorrect answers
  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const optionArray = [Option1, Option2, Option3, Option4];

  // Handle input change for user details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
  };

  // Handle start quiz button click
  const handleSubmit = () => {
    if (userDetails.fullName && userDetails.idNumber && userDetails.userClass) {
      setUserDetails({ ...userDetails, submitted: true });
    } else {
      alert("Please fill out all fields.");
    }
  };

  // Check answer function
  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("Correct");
        setLock(true);
        setScore(prev => prev + 1);
        setCorrectCount(prev => prev + 1);
      } else {
        e.target.classList.add("Wrong");
        setLock(true);
        setIncorrectCount(prev => prev + 1);
        optionArray[question.ans - 1].current.classList.add("Correct");
      }
    }
  };

  // Next question function
  const next = () => {
    if (lock) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      setIndex(index + 1);
      setQuestion(data[index + 1]);
      setLock(false);
      optionArray.forEach(option => {
        option.current.classList.remove("Wrong");
        option.current.classList.remove("Correct");
      });
    }
  };

  // Reset quiz and log out user
  const reset = () => {
    setUserDetails({
      fullName: '',
      idNumber: '',
      userClass: '',
      submitted: false
    });
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  // Calculate average score
  const averageScore = (score / data.length) * 100;
  const passed = averageScore >= 50; // Assuming 50% is the passing score

  return (
    <div className='container'>
      {/* Display user details form if details are not submitted */}
      {!userDetails.submitted ? (
        <div>
          <h1>Please Enter Your Details</h1>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={userDetails.fullName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="idNumber"
            placeholder="ID Number"
            value={userDetails.idNumber}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="userClass"
            placeholder="Class"
            value={userDetails.userClass}
            onChange={handleInputChange}
          />
          <button onClick={handleSubmit}>Start Quiz</button>
        </div>
      ) : (
        /* Display quiz questions and results after details are submitted */
        <>
          <h1>Welcome to the Quiz, {userDetails.fullName}!</h1>
          <hr />
          {result ? (
            /* Display quiz results after completing all questions */
            <div>
              <h2>Your Score: {score} out of {data.length}</h2>
              <p>Total Correct: {correctCount}</p>
              <p>Total Incorrect: {incorrectCount}</p>
              <p>Total Questions: {data.length}</p>
              <p>Average: {averageScore.toFixed(2)}%</p>
              {passed ? (
                <p>Congratulations! You passed the quiz.</p>
              ) : (
                <p>Sorry, you did not pass. Better luck next time!</p>
              )}
              <button onClick={reset}>Log Out</button>
            </div>
          ) : (
            /* Display current question and options during quiz */
            <>
              <h2>{index + 1}. {question.question}</h2>
              <ul>
                <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
                <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
                <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
                <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
              </ul>
              <button onClick={next}>Next</button>
              <div className="index">{index + 1} of {data.length} questions</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
