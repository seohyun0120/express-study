import { Request, Response } from 'express';
import { map, omit } from 'lodash';
import { ICreatePost, IUpdatePost } from '../../../../src/models/post';
import PostService from './post.services';

const getPosts = async (req: Request, res: Response) => {
	try {
		const posts = await PostService.getPosts({});
		const result = map(posts, (p) => omit(p, '__v'));

		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
}

const getPost = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const post = await PostService.getPost(id);
		return res.status(200).json({
			data: post
		});
	} catch ([status, code, err]) {
		return res.status(status).json({ error: { code, err } });
	}
}

const createPost = async (req: Request, res: Response) => {
	const { author, title, content } = req.body as ICreatePost;
	try {
		const post = await PostService.createPost(author, title, content);
		return res.status(201).json({ data: post });
	} catch ([status, code, err]) {
		return res.status(status).json({ error: { code, err } });
	}
}

const updatePost = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, content } = req.body as IUpdatePost;

	try {
		const post = await PostService.updatePost(id, title, content);
		return res.status(201).json({ data: post });
	} catch ([status, code, err]) {
		return res.status(status).json({ error: { code, err } });
	}
}

const deletePost = async (req: Request, res: Response) => {
	const { id } = req.params;
	
	try {
		const post = await PostService.deletePost(id);
		return res.status(200).json({ data: post });
	} catch ([status, code, err]) {
		return res.status(status).json({ error: { code, err } });
	}
}

export default { getPosts, getPost, createPost, updatePost, deletePost };