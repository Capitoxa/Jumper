window.addEventListener("load", function () {
	window.scrollTo(0, 0);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("ServiceWorker.js");
    }
  });
  var unityInstanceRef;
  var unsubscribe;
  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var loadingRoot = document.querySelector("#unity-loading-root")
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var warningBanner = document.querySelector("#unity-warning");
  var qrCode = document.querySelector("#qr_code");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }

  var buildUrl = "Build";
  var loaderUrl = buildUrl + "/5bc3bd75e437661009bffc9c65a07688.loader.js";
  var config = {
    dataUrl: buildUrl + "/96034438b88fa99a579cd3feedd90e00.data.gz",
    frameworkUrl: buildUrl + "/89151c9c076371c748db7576ca2bf49e.framework.js.gz",
    codeUrl: buildUrl + "/74f3f76d96fb6c301e4192b6c2662dee.wasm.gz",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Jumper",
    productVersion: "1.0.4",
    showBanner: unityShowBanner,
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  loadingRoot.style.display = "block";

	// Tutorial slideshow logic
	/* const tutorialImages = [
		"TemplateData/_tutorial_1.png",
		"TemplateData/_tutorial_2.png",
		"TemplateData/_tutorial_3.png"
	];
	let currentIndex = 0;
	const tutorialImg = document.getElementById("tutorial-img");
	const loadingText = document.getElementById("loading-text");

	// Rotate images every 3 seconds
	const slideshowInterval = setInterval(() => {
		currentIndex = (currentIndex + 1) % tutorialImages.length;
		tutorialImg.src = tutorialImages[currentIndex];
	}, 2000); */

function resizeUnityCanvas() {
    const canvas = document.getElementById("unity-canvas");

    const targetW = 720;
    const targetH = 1280;
    const targetAspect = targetW / targetH;

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const winAspect = winW / winH;

    let newW, newH;

    if (winAspect > targetAspect) {
        // Window too wide → fit by height
        newH = winH;
        newW = newH * targetAspect;
    } else {
        // Window too tall → fit by width
        newW = winW;
        newH = newW / targetAspect;
    }

    canvas.style.width = newW + "px";
    canvas.style.height = newH + "px";

    // Update WebGL resolution to avoid blurriness
    canvas.width = newW * window.devicePixelRatio;
    canvas.height = newH * window.devicePixelRatio;
}

window.addEventListener("resize", resizeUnityCanvas);
window.addEventListener("orientationchange", resizeUnityCanvas);
window.addEventListener("load", resizeUnityCanvas);

	const barElement = document.querySelector("#unity-progress-bar-empty");
	const sprite = document.getElementById("progress-sprite");

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
	createUnityInstance(canvas, config, (progress) => {
		progressBarFull.style.width = 100 * progress + "%";
		const barWidth = barElement ? barElement.clientWidth : 0;
		sprite.style.left = (progress * barWidth) + "px";
		
	}).then((unityInstance) => {
	  unityInstanceRef = unityInstance;
	  
	  //clearInterval(slideshowInterval);
	  
	  document.getElementById("tutorial-container").style.display = "none";
	  
	  loadingRoot.style.display = "none";

	  /* window.Telegram.WebApp.onEvent('activated', () => {
		unityInstanceRef.Module.SendMessage("SoundManager(Clone)", "UnmuteAll");
		unityInstanceRef.Module.resumeMainLoop();
	  });
				
	  window.Telegram.WebApp.onEvent('deactivated', () => {
		unityInstanceRef.Module.SendMessage("SoundManager(Clone)", "MuteAll");  
		unityInstanceRef.Module.pauseMainLoop();
	  }); */
	  
	  // ✅ Detect tab visibility changes
	  document.addEventListener("visibilitychange", function () {
		if (document.hidden) {
		  console.log("Tab hidden (unfocused)");
		  unityInstanceRef.SendMessage("SocketIOManager", "OnTabHidden");
		} else {
		  console.log("Tab visible (focused)");
		  unityInstanceRef.SendMessage("SocketIOManager", "OnTabVisible");
		}
	  });

	}).catch((message) => {
	  alert(message);
	});
  };
  document.body.appendChild(script);
  
