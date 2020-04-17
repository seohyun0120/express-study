import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interfaces/IPost';

const PostSchema: Schema = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  viewNum: { type: Number, required: true, default: 0 },
  comments: [
    {
      type: new Schema({
        author: { type: String, required: true },
        text: { type: String, required: true },
      }, {
        timestamps: true,
      })
    }
  ],
  fileId: { type: Schema.Types.ObjectId }
}, {
  timestamps: true,
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export { PostModel };
