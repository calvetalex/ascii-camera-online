var camera = (() => {
  var options;
  var video, canvas, context;
  var renderTimer;

  function initVideoStream() {
    video = document.createElement("video");
    video.setAttribute("width", options.width);
    video.setAttribute("height", options.height);
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mediaDevices.GetUserMedia ||
      navigator.msGetUserMedia;
    window.URL =
      window.URL || window.webkitURL || window.mozURL || window.msURL;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: true,
          audio: false,
        },
        function (stream) {
          options.onSuccess();

          if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
          } else {
            video.srcObject = stream;
          }

          initCanvas();
        },
        options.onError
      );
    } else {
      options.onNotSupported();
    }
  }

  function initCanvas() {
    canvas = options.targetCanvas || document.createElement("canvas");
    canvas.setAttribute("width", options.width);
    canvas.setAttribute("height", options.height);

    context = canvas.getContext("2d");

    // mirror video
    if (options.mirror) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
  }

  function startCapture() {
    video.play();

    renderTimer = setInterval(function () {
      try {
        context.drawImage(video, 0, 0, video.width, video.height);
        options.onFrame(canvas);
      } catch (e) {
        // TODO
      }
    }, Math.round(1000 / options.fps));
  }

  function stopCapture() {
    pauseCapture();

    if (video.mozSrcObject !== undefined) {
      video.mozSrcObject = null;
    } else {
      video.srcObject = null;
    }
  }

  function pauseCapture() {
    if (renderTimer) clearInterval(renderTimer);
    video.pause();
  }

  return {
    init: function (captureOptions) {
      var doNothing = function () {};

      options = captureOptions || {};

      options.fps = options.fps || 30;
      options.width = options.width || 1280;
      options.height = options.height || 720;
      options.mirror = options.mirror || false;
      options.targetCanvas = options.targetCanvas || null; // TODO: is the element actually a <canvas> ?

      options.onSuccess = options.onSuccess || doNothing;
      options.onError = options.onError || doNothing;
      options.onNotSupported = options.onNotSupported || doNothing;
      options.onFrame = options.onFrame || doNothing;

      initVideoStream();
    },

    start: startCapture,

    pause: pauseCapture,

    stop: stopCapture,
  };
})();
