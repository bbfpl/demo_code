export default {
  /**
   * file 转成 dataURL
   * @param file 文件
   * @param callback 回调函数
   */
  fileToDataURL(file, callback) {
    const reader = new window.FileReader()
    reader.onload = function (e) {
      callback(e.target.result)
    }
    reader.readAsDataURL(file)
  },
  // dataURL 图片绘制 canvas，然后经过处理（裁剪 & 压缩）再转成 dataURL
  compressDataURL(dataURL, ratio, callback) {
    const img = new window.Image()
    img.src = dataURL
    // onload
    img.onload = function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 100 * ratio.w
      canvas.height = 100 * ratio.h
      const RATIO = canvas.width / canvas.height
      let cutx = 0
      let cuty = 0
      let cutw = img.width
      let cuth = img.height
      if (cutw / cuth > RATIO) {
        // 宽超过比例了]]
        let realw = cuth * RATIO
        cutx = (cutw - realw) / 2
        cutw = realw
      } else if (cutw / cuth < RATIO) {
        // 长超过比例了]]
        let realh = cutw / RATIO
        cuty = (cuth - realh) / 2
        cuth = realh
      }
      ctx.drawImage(img, cutx, cuty, cutw, cuth, 0, 0, canvas.width, canvas.height)
      const ndata = canvas.toDataURL('image/jpeg', 1)
      callback(ndata)
    }
  },
  // dataURL 转成 file
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = window.atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new window.Blob([u8arr], {
      type: mime
    }) // if env support File, also can use this: return new File([u8arr], filename, { type: mime });
  },
  blobToArrayBuffer(file, callback) {
    // blob转arrayBuffer
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function (event) {
      callback(event.target.result)
    }
  }
}