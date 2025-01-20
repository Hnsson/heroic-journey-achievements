const express = require('express');
const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://localhost:27017/achievements')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));


app.get('/achievements', async (req, res) => {
    try {
        const { search } = req.query;
        let achievements;
        
        // If no search query is provided, return all achievements
        if (!search) {
            achievements = await Achievement.find();
        } else {
            achievements = await Achievement.find({
                $text: { $search: search },
            });
        }
        
        res.render('achievements', { achievements, search });
    } catch (err) {
        console.error('Error fetching achievements', err);
        res.status(500).send('Server error');
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));