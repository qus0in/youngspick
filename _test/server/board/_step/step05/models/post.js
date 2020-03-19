// 모듈 불러오기
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment')
const pagination = require('mongoose-paginate');

// 스키마 정의
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contents: { type: String, required: true },
    author: { type: String, required: true }
}, { timestamps: true });
postSchema.plugin(autoIncrement.plugin, { model: 'Post', startAt: 1 });
postSchema.plugin(pagination);

// 모델 생성 및 내보내기
module.exports = mongoose.model('Post', postSchema);