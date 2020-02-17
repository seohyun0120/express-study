import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
	author: string;
	title: string;
	content: string;
}

const PostSchema: Schema = new Schema({
	author: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String }
}, {
	timestamps: true,
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export { PostModel };