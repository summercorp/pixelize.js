window.onresize = function () {
  imageEditor.ui.resizeEditor()
}

let isInitialize = false
let imageData, colors, percent

let i = setInterval(() => {
  if (document.querySelector('.lower-canvas') && document.querySelector('.upper-canvas') && document.querySelector('.tui-image-editor-load-btn')) {
    clearInterval(i)

    let lowerCanvas = document.querySelector('.lower-canvas')
    let lowerContext = lowerCanvas.getContext('2d')

    let upperCanvas = document.querySelector('.upper-canvas')
    let upperContext = upperCanvas.getContext('2d')

    upperCanvas.addEventListener('mousemove', handler, false)
    let isToggled = false

    upperCanvas.addEventListener('click', () => {
      if (isToggled) {
        upperCanvas.addEventListener('mousemove', handler, false)
      } else {
        upperCanvas.removeEventListener('mousemove', handler, false)
      }
      isToggled = !isToggled
    }, false)

    function handler(ev) {
      if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX
        ev._y = ev.layerY
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX
        ev._y = ev.offsetY
      }

      percent = ev._x / upperCanvas.offsetWidth
      colors = []

      if (!isInitialize) {
        imageData = lowerContext.getImageData(0, 0, upperCanvas.width, upperCanvas.height)
        isInitialize = true
      }

      upperContext.putImageData(imageData, 0, 0)

      for (var i = 0; i < upperCanvas.height; i++) {
        colors.push(lowerContext.getImageData(upperCanvas.width * percent, i, 1, 1).data)
      }

      for (var i = 0; i < colors.length; i++) {
        upperContext.fillStyle = `rgba(${colors[i][0]},${colors[i][1]},${colors[i][2]},${colors[i][3]})`
        upperContext.fillRect(upperCanvas.width * percent, i, upperCanvas.width - upperCanvas.width * percent, 1)
      }
    }
  }
}, 10)

function onChangeFile() {
  isInitialize = false
  imageData = null
}
