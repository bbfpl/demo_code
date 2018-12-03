function uuid() {
  return Date.now().toString().slice(5, 13) + guid(8) + guid(8) + guid(8) + guid(8);
}

function guid(length) {
  length = length === '' ? 16 : length;
  let guid = '';
  for (var i = 0; i < length; i++) {
    let n = Math.random() * 16.0;
    guid += Math.floor(n).toString(16);
  }
  return guid;
}

function getImagesFromUploader(uploader) {
  const { images } = uploader;
  return images.map(item => item.image.replace('@!large.png', ''));
}

module.exports = {
  uuid,
  getImagesFromUploader
}
