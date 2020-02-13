import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

interface IPost {
	postId: Number,
	author: String,
	title: String,
	content: String | null
}

const posts: IPost[] = [
	{
		postId: 1,
		author: 'user1',
		title: '1st post',
		content: '1번째 글'
	},
	{
		postId: 2,
		author: 'user2',
		title: '2nd post',
		content: '2번째 글'
	},
]

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(port, () => {
	console.log('server started!');
});

// 전체 글 조회
app.get('/api/v1/posts', (req, res) => {
	try {
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

// 개별 글 조회
app.get('/api/v1/posts/:postId', (req, res) => {
	try {
		const { postId } = req.params;
		const post = posts.find(p => p.postId === parseInt(postId));
		if (!post) {
			return res.status(404).json({
				error: {
					code: 1,
					message: `postID '${postId}' Not found`
				}
			});
		}
		return res.send(post);
	} catch (error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
});

// 글 작성
app.post('/api/v1/posts', (req, res) => {
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
			return res.status(201).json({
				data: {
					author,
					title,
					content
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

// 글 수정
app.patch('/api/v1/posts/:postId', (req, res) => {
	try {
		const { postId } = req.params;
		const { author, title, content } = req.body;
		const post = posts.find(p => p.postId === parseInt(postId));
		if (!post) {
			return res.status(404).json({
				error: {
					code: 1,
					message: `postID '${postId}' Not found.`
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
			return res.status(201).json({
				data: {
					postId,
					author,
					title,
					content
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
})


// 글 삭제
app.delete('/api/v1/posts/:postId', (req, res) => {
	try {
		const { postId } = req.params;
		const post = posts.find(p => p.postId === parseInt(postId));
		if (!post) {
			return res.status(404).json({
				error: {
					code: 1,
					message: `postID '${postId}' Not found.`
				}
			});
		} else {
			return res.status(200).json(
				'Successfully deleted'
			);
		}
	} catch (error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
})

export default app;