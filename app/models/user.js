import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// define a schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// assign a function to the "methods" object of our UserSchema
// UserSchema.methods.findSimilarTypes = function(cb) {
//   return this.model('User').find({ type: this.type }, cb);
// };

UserSchema.query.byName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};

UserSchema.statics.findByName = function(name, cb) {
  return this.find({ name: name }, cb);
};

UserSchema.statics.findById = function(id, cb) {
  return this.find({ _id: id }, cb);
};

UserSchema.statics.findAll = function(name, cb) {
  return this.find({}, cb);
};

const User = mongoose.model('users', UserSchema);

export default User;