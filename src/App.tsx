import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './App.css';

type Color = {
  hex: string;
  locked: boolean;
};

type Palette = {
  name: string;
  colors: Color[];
};

function App() {
  const [currentPalette, setCurrentPalette] = useState<Palette>({
    name: '',
    colors: Array.from({ length: 5 }, () => ({ hex: getRandomColor(), locked: false })),
  });
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);

  useEffect(() => {
    const palettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]') as Palette[];
    setSavedPalettes(palettes);
  }, []);

  function handleGeneratePalette(): void {
    setCurrentPalette((prevPalette) => ({
      ...prevPalette,
      colors: generatePalette(prevPalette.colors),
    }));
  }

  function savePalette(): void {
    const name = prompt('Enter a name for your palette:') || 'Untitled';
    const newPalette = { ...currentPalette, name };
    const newPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(newPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(newPalettes));
  }

  function generatePalette(existingColors: Color[] = []): Color[] {
    return existingColors.map((color) =>
      color.locked ? color : { hex: getRandomColor(), locked: false }
    );
  }

  function getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  function deletePalette(index: number): void {
    const newPalettes = savedPalettes.filter((_, i) => i !== index);
    setSavedPalettes(newPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(newPalettes));
  }

  function toggleLock(index: number): void {
    const newColors = currentPalette.colors.map((color, i) =>
      i === index ? { ...color, locked: !color.locked } : color
    );
    setCurrentPalette({ ...currentPalette, colors: newColors });
  }

  return (
    <div className="container">
      <button onClick={handleGeneratePalette}>Generate Palette</button>
      <div className="palette">
        {currentPalette.colors && currentPalette.colors.map((color, index) => (
          <CopyToClipboard key={index} text={color.hex}>
            <div
              className="color-block"
              style={{ backgroundColor: color.hex }}
              onClick={() => toggleLock(index)}
            >
              {color.hex} {color.locked ? '🔒' : '🔓'}
            </div>
          </CopyToClipboard>
        ))}
      </div>
      <button onClick={savePalette}>Save Palette</button>
      <div className="saved-palettes">
        {savedPalettes && savedPalettes.map((palette, index) => (
          <div key={index} className="saved-palette">
            <strong>{palette.name}</strong>
            {palette.colors && palette.colors.map((color, i) => (
              <div key={i} className="color-block" style={{ backgroundColor: color.hex }}>
                {color.hex}
              </div>
            ))}
            <button className="delete-button" onClick={() => deletePalette(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;