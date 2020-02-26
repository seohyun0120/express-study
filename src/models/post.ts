import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interfaces/IPost';

const PostSchema: Schema = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
}, {
  timestamps: true,
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export { PostModel };