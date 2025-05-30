import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const wordData = [
  { id: '1', word: 'Puppy', category: 'Animals' },
  { id: '2', word: 'Kitten', category: 'Animals' },
  { id: '3', word: 'Happy', category: 'Emotions' },
  { id: '4', word: 'Sad', category: 'Emotions' },
  { id: '5', word: 'Blue', category: 'Colors' },
  { id: '6', word: 'Red', category: 'Colors' },
];

const categories = ['Animals', 'Emotions', 'Colors'];

export default function Sort() {
  const [words, setWords] = useState(wordData);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const binRefs = useRef(categories.reduce((acc, cat) => ({ ...acc, [cat]: null }), {}));

  const handleDragEnd = (wordId, categoryId) => {
    console.log('handleDragEnd called:', { wordId, categoryId });
    if (!categoryId) {
      console.log('No valid category found');
      setFeedback('Drop the word in a category bin!');
      setTimeout(() => setFeedback(''), 1500);
      return;
    }
    const word = words.find((w) => w.id === wordId);
    if (!word) {
      console.error('Word not found:', wordId);
      return;
    }
    if (word.category === categoryId) {
      console.log('Correct match:', word.word, categoryId);
      setScore((prev) => prev + 1);
      setFeedback(`Correct! ${word.word} belongs to ${categoryId}`);
      setWords((prev) => prev.filter((w) => w.id !== wordId));
    } else {
      console.log('Incorrect match:', word.word, categoryId);
      setFeedback('Incorrect. Try again!');
    }
    setTimeout(() => {
      console.log('Clearing feedback');
      setFeedback('');
    }, 1500);
  };

  const checkDropTarget = (info, wordId) => {
    for (const category of categories) {
      const bin = binRefs.current[category];
      if (!bin) continue;
      const rect = bin.getBoundingClientRect();
      const x = info.point.x;
      const y = info.point.y;
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return category;
      }
    }
    return null;
  };

  const isGameComplete = words.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Learn English - Vocabulary Sorting</title>
        <meta name="description" content="Practice English vocabulary with our interactive sorting game!" />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vocabulary Sorting Game</h1>
        {/* Navigation Links */}
        <div className="flex justify-center gap-4 mb-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            Home
          </Link>
          <Link href="/lessons" className="text-blue-600 hover:text-blue-800 font-semibold">
            Memory Game
          </Link>
        </div>
        {isGameComplete ? (
          <motion.div
            key="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Congratulations! You scored {score} out of {wordData.length}!
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Restarting game');
                setWords(wordData);
                setScore(0);
                setFeedback('');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Play Again
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  id={category}
                  ref={(el) => (binRefs.current[category] = el)}
                  className="category-bin p-6 bg-gray-100 rounded-xl text-center font-semibold text-gray-800 border-2 border-gray-300 min-h-[120px] flex items-center justify-center"
                  whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {words.map((word) => (
                <motion.div
                  key={word.id}
                  drag
                  dragConstraints={{ top: -200, left: -200, right: 200, bottom: 200 }}
                  onDragEnd={(e, info) => {
                    const categoryId = checkDropTarget(info, word.id);
                    console.log('Drag ended, target category:', categoryId);
                    handleDragEnd(word.id, categoryId);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, zIndex: 10 }}
                  className="px-4 py-2 bg-blue-200 rounded-lg text-gray-800 font-semibold cursor-grab select-none"
                >
                  {word.word}
                </motion.div>
              ))}
            </div>
          </>
        )}
        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`mt-4 text-center font-semibold ${
              feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback}
          </motion.p>
        )}
        <p className="mt-6 text-center text-gray-600 font-medium">Score: {score} / {wordData.length}</p>
      </motion.div>
    </div>
  );
}
