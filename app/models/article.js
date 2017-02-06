import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;

// define a schema
const ArticleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  type: { type: String },
  isShow: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});

ArticleSchema.plugin(mongoosePaginate);

const Article = mongoose.model('articles', ArticleSchema);

// ArticleSchema.statics.findAll = function(val, cb) {
//   return this.find({ _id: val }, cb);
// };

export default Article;