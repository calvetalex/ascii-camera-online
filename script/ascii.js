// To work with contrast I used:
// https://hackernoon.com/image-processing-algorithms-adjusting-contrast-and-image-brightness-0y4y318a
// https://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
// calculate pixel brightness
// https://stackoverflow.com/questions/59603278/how-to-determine-colors-perceived-brightness
// https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color

const ascii = (() => {
  function asciiFromCanvas(canvas, options) {
    const characters = " .',:;l!?CG#%$@".split("");
    const context = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const contrastFactor =
	(259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
    const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    let asciiCharacters = "";

    for (let y = 0; y < canvasHeight; y += 2) {
      for (let x = 0; x < canvasWidth; x += 1) {
        const offset = (y * canvasWidth + x) * 4;
        const color = getColorAtOffset(imageData.data, offset);
        const contrastedColor = {
          red: bound(Math.floor((color.red - 128) * contrastFactor) + 128, [
            0,
            255,
          ]),
          green: bound(Math.floor((color.green - 128) * contrastFactor) + 128, [
            0,
            255,
          ]),
          blue: bound(Math.floor((color.blue - 128) * contrastFactor) + 128, [
            0,
            255,
          ]),
          alpha: color.alpha,
        };
        const brightness =
          (0.299 * contrastedColor.red +
            0.587 * contrastedColor.green +
            0.114 * contrastedColor.blue) /
          255;
        const character =
          characters[
            characters.length -
              1 -
              Math.round(brightness * (characters.length - 1))
          ];
        asciiCharacters += character;
      }
      asciiCharacters += "\n";
    }
    options.callback(asciiCharacters);
  }

  function getColorAtOffset(data, offset) {
    return {
      red: data[offset],
      green: data[offset + 1],
      blue: data[offset + 2],
      alpha: data[offset + 3],
    };
  }

  function bound(value, interval) {
    return Math.max(interval[0], Math.min(interval[1], value));
  }

  return {
    fromCanvas: function (canvas, options) {
      options = options || {};
      options.contrast = options.contrast || 128;
      options.callback = options.callback || doNothing;
      return asciiFromCanvas(canvas, options);
    },
  };
})();
