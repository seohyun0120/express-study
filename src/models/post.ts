import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
	postId: number;
	author: string;
	title: string;
	content: string;
}

const PostSchema: Schema = new Schema({
	postId: { type: String, required: true, unique: true },
	author: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String }
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export { PostModel };