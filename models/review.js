// 모듈 불러오기
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment')
const pagination = require('mongoose-paginate');

// 스키마 정의
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    comments: { type: String, required: true, minlength: 20, maxlength: 200 },
    rate: { type: Number, min: 0, max: 5, required: true },
    image: { type: String, required: true }
}, { timestamps: true });
reviewSchema.plugin(autoIncrement.plugin, { model: 'Review', startAt: 1 });
reviewSchema.plugin(pagination);

// 모델 생성 및 내보내기
module.exports = mongoose.model('Review', reviewSchema);