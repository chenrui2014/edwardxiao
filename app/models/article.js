import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// define a schema
const ArticleSchema = new Schema({
  title: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  isShow: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('articles', ArticleSchema);

export default Article;