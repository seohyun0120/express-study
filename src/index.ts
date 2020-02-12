import express from 'express';

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

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(port, () => {
	console.log('server started!');
});

// 전체 글 조회
app.get('/api/v1/posts', (req, res) => {
	try {
		res.send(posts);
	} catch(error) {
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
		const requestId = parseInt(req.params.postId);
		const post = posts.find(p => p.postId === requestId);
		if (!post) {
			return res.status(404).json({
				error: {
					code: 1,
					message: `postID '${requestId}' NOT FOUND`
				}
			});
		}
		return res.send(post);
	} catch(error) {
		return res.status(500).json({
			error: {
				code: 500,
				message: 'Internal Server Error'
			}
		});
	}
});
