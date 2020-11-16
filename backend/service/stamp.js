const axios = require('axios');
const fs = require('fs');

const renderText = async (item) => {
  return `
    <text
      fill="${item.color}"
      x="${item.x}px"
      y="${item.y}px"
      font-size="${item.size}px"
      font-family="serif"
    >
      ${item.text}
    </text>
    `;
};

const renderImage = async (item) => {
  const image = await axios.get(item.imageUrl, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(image.data).toString('base64');
  return `
    <image
      xlink:href="data:image/png;base64,${base64}"
      preserveAspectRatio="xMidYMid slice"
      height="${item.h}px"
      width="${item.w}px"
      x="${item.x}px"
      y="${item.y}px"
    />
    `;
};

const render = async ({ width, height, items }) => {
  const content = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    switch (it.type) {
      case 'image':
        content.push(await renderImage(it));
      case 'text':
        content.push(await renderText(it));
    }
  }
  return `
    <svg
      fill="white" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">       
    >
      <rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF" />
      ${content.join('')}
    </svg>
    `;
};

module.exports = {
  render,
};
