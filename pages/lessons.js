import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const cardData = [
  { id: 1, type: 'word', content: 'Big', matchId: 1, audio: 'https://api.voicerss.org/?key=b390a8d8b14f461eab3468806e12cf89&hl=en-us&src=Big' },
  { id: 2, type: 'meaning', content: 'Large in size', matchId: 1 },
  { id: 3, type: 'word', content: 'Happy', matchId: 2, audio: 'https://api.voicerss.org/?key=b390a8d8b14f461eab3468806e12cf89&hl=en-us&src=Happy' },
  { id: 4, type: 'meaning', content: 'Feeling joyful', matchId: 2 },
  { id: 5, type: 'word', content: 'Puppy', matchId: 3, audio: 'https://api.voicerss.org/?key=b390a8d8b14f461eab3468806e12cf89&hl=en-us&src=Puppy' },
  { id: 6, type: 'meaning', content: 'Young dog', matchId: 3 },
];

export default function Lessons() {
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState('');

  const handleCardClick = (card) => {
    if (flippedCards.length < 2 && !flippedCards.includes(card.id) && !matchedPairs.includes(card.matchId)) {
      setFlippedCards([...flippedCards, card.id]);

      // Play audio for word cards
      if (card.type === 'word' && card.audio) {
        const audio = new Audio(card.audio);
        audio.play().catch((error) => console.error('Audio playback failed:', error));
      }

      if (flippedCards.length === 1) {
        const firstCard = cardData.find((c) => c.id === flippedCards[0]);
        if (firstCard.matchId === card.matchId && firstCard.id !== card.id) {
          setFeedback('Correct!');
          setMatchedPairs([...matchedPairs, card.matchId]);
          setFlippedCards([]);
        } else if (firstCard.matchId !== card.matchId) {
          setFeedback('Try again!');
          setTimeout(() => {
            setFlippedCards([]);
            setFeedback('');
          }, 1500);
        }
      }
    }
  };

  const isGameComplete = matchedPairs.length === cardData.length / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Learn English - Vocabulary Lessons</title>
        <meta name="description" content="Learn English vocabulary with our interactive matching game!" />
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vocabulary Matching Game</h1>
        {/* Navigation Link */}
        <div className="text-center mb-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700 font-medium">
            Back to Quiz
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Congratulations! You matched all pairs!</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFlippedCards([]);
                setMatchedPairs([]);
                setFeedback('');
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Play Again
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cardData.map((card) => {
              const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.matchId);
              const isMatched = matchedPairs.includes(card.matchId);
              return (
                <motion.div
                  key={card.id}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-32 cursor-pointer"
                  onClick={() => !isMatched && handleCardClick(card)}
                >
                  <motion.div
                    className="absolute w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-800 font-medium backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    ?
                  </motion.div>
                  <motion.div
                    className="absolute w-full h-full bg-blue-100 rounded-lg flex items-center justify-center text-gray-800 font-medium backface-hidden"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                  >
                    {card.content}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              'mt-4 text-center font-semibold ' +
              (feedback.includes('Correct') ? 'text-green-600' : 'text-red-600')
            }
          >
            {feedback}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
