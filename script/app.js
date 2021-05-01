(() => {
  const asciiContainer = document.getElementById("ascii");
  let capturing = false;

  camera.init({
    width: 160,
    height: 120,
    fps: 30,
    mirror: true,

    onFrame: function (canvas) {
      ascii.fromCanvas(canvas, {
        callback: function (asciiString) {
          asciiContainer.innerHTML = asciiString;
        },
      });
    },

    onSuccess: function () {
      const button = document.getElementById("button");
      button.style.display = "block";
      button.onclick = function () {
        if (capturing) {
          camera.pause();
          button.innerText = "resume";
        } else {
          camera.start();
          button.innerText = "pause";
        }
        capturing = !capturing;
      };
    },

    onError: function (error) {
      console.error(error);
    },

    onNotSupported: function () {
      asciiContainer.style.display = "none";
      document.getElementById("notSupported").style.display = "block";
    },
  });
})();
