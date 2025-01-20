const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('fast-csv');
const Achievement = require('./models/Achievement');

const csvFilePath = 'achievements.csv';

mongoose.connect('mongodb://localhost:27017/achievements')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

const uploadCSVToMongoDB = async () => {
  const achievements = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser.parse({ headers: true }))
    .on('data', (row) => {
      achievements.push({
        title: row.title,
        objective: row.objective,
        points: parseInt(row.points, 10)
      });
    })
    .on('end', async () => {
      try {
        await Achievement.insertMany(achievements, { ordered: false });
        console.log('Achievements uploaded to MongoDB');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error uploading to MongoDB:', error.message);
      }
    });
};

uploadCSVToMongoDB();
