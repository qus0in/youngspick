const mongoose = require('mongoose');

// Define Schemes
const todoSchema = new mongoose.Schema({
  todoid: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  completed: { type: String, default: false }
},
{
  timestamps: true
});

// Create new todo document
todoSchema.statics.create = function (payload) {
  // this === Model
  const todo = new this(payload);
  // return Promise
  return todo.save();
};

// Find All
todoSchema.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by todoid
todoSchema.statics.findOneByTodoid = function (todoid) {
  return this.findOne({ todoid });
};

// Update by todoid
todoSchema.statics.updateByTodoid = function (todoid, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ todoid }, payload, { new: true });
};

// Delete by todoid
todoSchema.statics.deleteByTodoid = function (todoid) {
  return this.remove({ todoid });
};

// Create Model & Export
module.exports = mongoose.model('Todo', todoSchema);
/*
https://poiemaweb.com/mongoose

Route	Method	Description
/todos	POST	todo 생성
/todos	GET	모든 todo 조회
/todos/todoid/:todoid	GET	todoid으로 todo 조회
/todos/todoid/:todoid	PUT	todoid으로 todo 조회 후 수정
/todos/todoid/:todoid	DELETE	todoid으로 todo 조회 후 삭제

node app.js
*/