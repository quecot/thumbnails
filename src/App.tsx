import React, { useState } from 'react';
import { makeNoise2D } from 'fast-simplex-noise';
import '@assets/css/index.css';
import logoImg from '@assets/images/logo.png';
import hexComplimentary from './utils/hex_complementary';
import roundRect from './utils/round_rect';

const addLogo = (context: CanvasRenderingContext2D) => {
  const logo = new Image();
  logo.src = logoImg;
  // eslint-disable-next-line func-names
  logo.onload = function () {
    const logoWidth = logo.width * 0.5;
    const logoHeight = logo.height * 0.5;

    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.drawImage(logo, canvasWidth - logoWidth - 12, canvasHeight - logoHeight - 12, logoWidth, logoHeight);
  };
};

const generateBackground = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): string => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const linearGradient = context.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

  const bgColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const compColor = hexComplimentary(bgColor);

  linearGradient.addColorStop(0, bgColor);
  linearGradient.addColorStop(1, compColor);

  context.fillStyle = linearGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const noise = makeNoise2D();
  context.fillStyle = 'white';

  context.filter = 'blur(1px)';
  const bgCols = 24;
  const bgRows = 12;
  for (let i = 0; i < bgCols; i += 1) {
    for (let j = 0; j < bgRows; j += 1) {
      const x = (canvas.width * i) / bgCols + canvas.width / (2 * bgCols);
      const y = (canvas.height * j) / 12 + canvas.height / (2 * bgRows);
      const radius = (1.5 * bgCols) * Math.abs(noise(x / 1000, y / 1000));
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
    }
  }
  context.filter = 'blur(0px)';
  return bgColor;
};

const reduceTextWidth = (videoTitle: string, context: CanvasRenderingContext2D): string => {
  let splitText = videoTitle;
  const textWidth = context.measureText(videoTitle).width;
  if (textWidth >= 1200) {
    let middle = Math.floor(videoTitle.length / 2);
    const before = videoTitle.lastIndexOf(' ', middle);
    const after = videoTitle.indexOf(' ', middle + 1);

    if (middle - before < after - middle) {
      middle = before;
    } else {
      middle = after;
    }
    splitText = `${videoTitle.substr(0, middle)}\n${videoTitle.substr(middle + 1)}`;
  }
  return splitText;
};

const writeTitle = (context: CanvasRenderingContext2D, videoTitle: string, canvas: HTMLCanvasElement, color: string) => {
  if (!videoTitle) { return; }

  const { width, height } = canvas;
  context.fillStyle = 'white';
  context.font = '72px tahoma';

  const reducedText = reduceTextWidth(videoTitle, context);
  const textHeight = 72 + 72 * (reducedText.match(/\n/g) || []).length;
  const splitText = reducedText.split('\n');
  const textWidth = Math.max(context.measureText(splitText[0]).width, context.measureText(splitText[1]).width);

  context.textAlign = 'center';
  context.textBaseline = 'middle';

  if (splitText.length === 1) {
    roundRect(context, (width / 2) - textWidth / 2 - 20, height / 2 - textHeight, textWidth + 40, 2 * textHeight, 24);
    context.fillStyle = color;
    context.fillText(videoTitle, 1280 / 2, 720 / 2, 1280);
  } else {
    roundRect(context, (width / 2) - textWidth / 2 - 20, height / 2 - textHeight, textWidth + 40, 1.5 * textHeight, 24);
    splitText.forEach((s, index) => {
      context.fillStyle = color;
      context.fillText(s, 1280 / 2, ((720 / 2) + (index * textHeight) / 2) - (textHeight / 2), 1280);
    });
  }
};

const generateImages = (videoTitle: string) => {
  const canvas = (document.querySelector('#canvas') as HTMLCanvasElement);

  canvas.height = 720;
  canvas.width = 1280;
  const context = canvas.getContext('2d');

  const color = generateBackground(context!, canvas);
  writeTitle(context!, videoTitle, canvas, color);
  addLogo(context!);
};

const handleClick = (e: React.FormEvent, setImageGenerated: React.Dispatch<React.SetStateAction<boolean>>) => {
  e.preventDefault();
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
      <div className="relative flex flex-col items-center justify-between w-screen h-screen pt-10 overflow-scroll justify">
        <form className="flex flex-col items-center gap-4" onSubmit={(e) => handleClick(e, setImageGenerated)} autoComplete="off">
          <h1 className="text-2xl font-semibold">Generador d&apos;imatges de portada</h1>
          <input
            type="text"
            onKeyUp={handleEnter}
            id="videoTitle"
          // eslint-disable-next-line max-len
            className="w-96 caret-transparent bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Títol del vídeo"
          />
          <button
            type="submit"
            id="submit"
          // eslint-disable-next-line max-len
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
          >
            Genera
          </button>
        </form>
        <div />
        <div className="flex flex-col items-center">
          <canvas id="canvas" className="w-[75%]" />
          { imageGenerated ? (
            <div className="pt-2">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                onClick={downloadImage}
              >
                Descarrega
              </button>

            </div>
          ) : <div />}
        </div>
        <div />
        <div />
      </div>
    </div>
  );
};

export default App;
