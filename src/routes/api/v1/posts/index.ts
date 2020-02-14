import express from 'express';
import { PostModel } from '../../../../models/post';
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		let posts = await PostModel.find({});
		res.json(posts);
	} catch (error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { author, title, content } = req.body;
		if (author === '' && title === '') {
			return res.status(404).json({
				error: {
					code: 2,
					message: 'Author and Title cannot be empty string'
				}
			});
		} else if (author === '') {
			return res.status(404).json({
				error: {
					code: 3,
					message: 'Author cannot be empty string'
				}
			});
		} else if (title === '') {
			return res.status(404).json({
				error: {
					code: 4,
					message: 'Title cannot be empty string'
				}
			});
		} else {
			const post = new PostModel({
				title,
				author,
				content,
			});
			console.log(post);
			await post.save((err) => {
				if (err) {
					return next(err);
				} else {
					return res.status(201).json({
						data: {
							author,
							title,
							content
						}
					});
				}
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
});

export default router;