import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

const quizData = [
  { question: "What is the opposite of 'big'?", options: ["Small", "Large", "Tall", "Wide"], answer: "Small" },
  { question: "Which word means 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], answer: "Joyful" },
  { question: "What do you call a young dog?", options: ["Kitten", "Puppy", "Cub", "Foal"], answer: "Puppy" },
  { question: "What do you do when you wake up in the morning?", options: ["Have lunch", "Eat cookies", "Have a sandwich", "Brush my teeth"], answer: "Brush my teeth" },
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    if (option === quizData[currentQuestion].answer) {
      setFeedback('Correct!');
      setScore(score + 1);
    } else {
      setFeedback('Incorrect! The correct answer is ' + quizData[currentQuestion].answer + '.');
    }
    setTimeout(() => {
      setFeedback('');
      setSelectedAnswer('');
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizEnded(true);
      }
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setFeedback('');
    setScore(0);
    setQuizEnded(false);
  };

  const baseButtonClass = 'w-full py-3 px-4 rounded-lg text-left text-gray-800 font-medium transition-colors duration-200 border-2';
  const feedbackClass = 'mt-4 text-center font-semibold';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Learn English - Interactive Quiz</title>
        <meta name="description" content="Practice English with our interactive quiz!" />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">English Learning Quiz</h1>
        {/* Progress Bar */}
        {!quizEnded && (
          <div className="flex justify-center gap-2 mb-4">
            {quizData.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: index === currentQuestion ? 1.2 : 1,
                  backgroundColor: index === currentQuestion ? '#3b82f6' : '#d1d5db',
                }}
                transition={{ duration: 0.3 }}
                className="w-3 h-3 rounded-full"
              />
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          {quizEnded ? (
            <motion.div
              key="final-score"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Quiz Complete! You scored {score} out of {quizData.length}!
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
              >
                Restart Quiz
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{quizData[currentQuestion].question}</h2>
              <div className="grid gap-4">
                {quizData[currentQuestion].options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === quizData[currentQuestion].answer;
                  const buttonClass = isSelected
                    ? baseButtonClass + ' ' + (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
                    : baseButtonClass + ' bg-gray-50 hover:bg-gray-100 border-gray-300';
                  return (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      className={buttonClass}
                      disabled={selectedAnswer !== ''}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!quizEnded && feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={feedbackClass + ' ' + (feedback.includes('Correct') ? 'text-green-600' : 'text-red-600')}
          >
            {feedback}
          </motion.p>
        )}
        {!quizEnded && (
          <p className="mt-6 text-center text-gray-600">Score: {score} / {quizData.length}</p>
        )}
      </motion.div>
    </div>
  );
}

