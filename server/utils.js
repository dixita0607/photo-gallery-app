const mime = require('mime-types');
const fs = require('fs');
const {v4: uuid} = require('uuid');
const path = require('path');

module.exports.savePhotoToDisk = ({mimetype, createReadStream}) => new Promise((resolve, reject) => {
  const ext = mime.extension(mimetype);
  const _id = uuid();
  const filepath = path.join('photos', _id + '.' + ext);
  const readStream = createReadStream();
  const writeStream = fs.createWriteStream(filepath);
  readStream.on('end', () => resolve({_id, url: '/' + filepath}));
  readStream.on('error', reject);
  readStream.pipe(writeStream);
});

module.exports.savePhotoToDatabase = async (db, user, {_id, url}) => {
  const photo = {_id, url, userId: user.sub, uploadedAt: Date.now()};
  const {insertedCount} = await db.collection('photos').insertOne(photo);
  if (insertedCount === 1) return photo;
  else throw Error('Could not insert photo');
};
