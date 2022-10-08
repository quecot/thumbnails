import React, { useState } from 'react';
import { makeNoise2D } from 'fast-simplex-noise';

import logoImg from '@assets/images/logo.png';

const addLogo = (context: CanvasRenderingContext2D) => {
  const logo = new Image();
  logo.src = logoImg;
  // eslint-disable-next-line func-names
  logo.onload = function () {
    const logoWidth = logo.width * 0.5;
    const logoHeight = logo.height * 0.5;

    const canvasWidth = context.canvas.clientWidth;
    const canvasHeight = context.canvas.clientHeight;

    context.drawImage(logo, canvasWidth - logoWidth - 12, canvasHeight - logoHeight - 12, logoWidth, logoHeight);
  };
};

const generateBackground = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const linearGradient = context.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
  linearGradient.addColorStop(0, 'green');
  linearGradient.addColorStop(1, '#41ad31');
  context.fillStyle = linearGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const noise = makeNoise2D();
  context.fillStyle = 'white';

  context.filter = 'blur(2px)';
  const bgCols = 24;
  const bgRows = 12;
  for (let i = 0; i < bgCols; i += 1) {
    for (let j = 0; j < bgRows; j += 1) {
      const x = (canvas.width * i) / bgCols + canvas.width / (2 * bgCols);
      const y = (canvas.height * j) / 12 + canvas.height / (2 * bgRows);
      const radius = (1.5 * bgCols) * Math.abs(noise(x, y));
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
    }
  }
  context.filter = 'blur(0px)';
};

const generateImages = (videoTitle: string) => {
  const canvas = (document.querySelector('#canvas') as HTMLCanvasElement);

  canvas.height = 720;
  canvas.width = 1280;
  const context = canvas.getContext('2d');

  context!.scale(0.5, 0.5);
  context!.translate(canvas.width / 2, canvas.height / 2);
  context!.textAlign = 'center';
  context!.textBaseline = 'top';

  context!.font = context!.font.replace(/\d+px/, '48px');

  generateBackground(context!, canvas);

  context!.fillStyle = 'black';
  context!.fillText(videoTitle.toUpperCase(), 1280 / 2, 720 / 2);

  addLogo(context!);
};

const handleClick = (setImageGenerated: React.Dispatch<React.SetStateAction<boolean>>) => {
  const videoTitle = (document.querySelector('#videoTitle') as HTMLInputElement).value;
  generateImages(videoTitle);
  setImageGenerated(true);
};

const handleEnter = () => {
  (document.querySelector('#videoTitle') as HTMLInputElement).addEventListener('keyup', (event) => {
    if (event.key !== 'Enter') return;
    (document.querySelector('#submit') as HTMLButtonElement).click();
  });
};

const downloadImage = () => {
  const link = document.createElement('a');
  link.download = 'portada.png';
  link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL();
  link.click();
};

const App = () => {
  const [imageGenerated, setImageGenerated] = useState(false);
  return (
    <div className="App">
      <div className="flex flex-col items-center justify-between w-screen h-screen pt-12 justify">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-semibold">Generador d&apos;imatges de portada</h1>
          <input
            type="text"
            onKeyUp={handleEnter}
            id="videoTitle"
          // eslint-disable-next-line max-len
            className="w-96 caret-transparent bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Títol del vídeo"
          />
          <button
            type="button"
            id="submit"
            onClick={() => handleClick(setImageGenerated)}
          // eslint-disable-next-line max-len
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Genera
          </button>
        </div>
        <div className="flex flex-col">
          <canvas id="canvas" width="1280" height="720" />
          { imageGenerated ? <button type="button" className="mt-[-160px]" onClick={downloadImage}>Descarrega</button> : <div />}
        </div>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default App;
