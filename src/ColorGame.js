// ColorGame.js

import React, { useState, useEffect } from 'react';

const ColorGame = () => {
  const [colors, setColors] = useState(['Red', 'Green', 'Blue', 'Yellow']);
  const [selectedColor, setSelectedColor] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const shuffleColors = () => {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const newSelectedColor = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
    setColors(shuffledColors);
    setSelectedColor(newSelectedColor);

    // Google Cloud Text-to-Speech API kullanımı (API anahtarı ve diğer bilgiler eksik)
    const textToSpeechUrl = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=YOUR_API_KEY';
    const audioData = {
      input: { text: newSelectedColor },
      voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'LINEAR16' }
    };

    fetch(textToSpeechUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(audioData),
    })
      .then(response => response.json())
      .then(data => {
        const audio = new Audio(`data:audio/wav;base64,${data.audioContent}`);
        audio.play();
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    if (gameStarted) {
      shuffleColors();
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const checkColor = (clickedColor) => {
    if (clickedColor === selectedColor) {
      setFeedback('Doğru! 👍');
      setCorrectCount((prevCount) => prevCount + 1);
      shuffleColors();
    } else {
      setFeedback('Yanlış! 🤔');
      setWrongCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
      <h1>Sözlü Renk Öğrenme Oyunu</h1>
      {!gameStarted && <button onClick={startGame} style={{ backgroundColor: '#3498db', color: 'white' }}>Oyunu Başlat</button>}
      {gameStarted && <p>{feedback}</p>}
      <div>
        {gameStarted &&
          colors.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color.toLowerCase(), margin: '5px', padding: '10px', borderRadius: '5px', color: 'white' }}
              onClick={() => checkColor(color)}
            >
              {color}
            </button>
          ))}
      </div>
      {gameStarted && (
        <div style={{ marginTop: '20px', color: 'black' }}>
          <p>Doğru Sayısı: {correctCount}</p>
          <p>Yanlış Sayısı: {wrongCount}</p>
        </div>
      )}
    </div>
  );
};

export default ColorGame;
