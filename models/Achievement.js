const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    objective: { type: String, required: true },
    points: { type: Number, required: true },
    tags: { type: [String], required: true }
});

achievementSchema.index({ title: 'text', objective: 'text', points: 'text' });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;