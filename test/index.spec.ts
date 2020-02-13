import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src'

chai.use(chaiHttp);
chai.should();

describe('Posts', () => {
	describe('/GET post', () => {
		it('should GET all the posts', (done) => {
			chai.request(app)
				.get('/api/v1/posts')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe('/GET/:id post', () => {
		it('should GET a post by the given id', (done) => {
			let postId = 1;
			chai.request(app)
				.get('/api/v1/posts/' + postId)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('postId');
					res.body.should.have.property('author');
					res.body.should.have.property('title');
					res.body.should.have.property('content');
					done();
				});
		});
	});

	describe('/POST post', () => {
		it('should POST a post', (done) => {
			let post = {
				author: 'seohyun',
				title: '1st',
				content: '1st content',
			};
			chai.request(app)
				.post('/api/v1/posts')
				.send(post)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('data');
					res.body.data.should.have.property('author').eql('seohyun');
					res.body.data.should.have.property('title').eql('1st');
					res.body.data.should.have.property('content').eql('1st content');
					done();
				});
		});
		it('should not POST a post if title and author are empty string', (done) => {
			let post = {
				author: '',
				title: '',
				content: '1st content',
			}
			chai.request(app)
				.post('/api/v1/posts')
				.send(post)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(2);
					res.body.error.should.have.property('message').eql('Author and Title cannot be empty string');
					done();
				});
		});
		it('should not POST a post if author is empty string', (done) => {
			let post = {
				author: '',
				title: '1st post',
				content: '1st content',
			}
			chai.request(app)
				.post('/api/v1/posts')
				.send(post)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(3);
					res.body.error.should.have.property('message').eql('Author cannot be empty string');
					done();
				});
		});

		it('should not POST a post if title is empty string', (done) => {
			let post = {
				author: 'seohyun',
				title: '',
				content: '1st content',
			}
			chai.request(app)
				.post('/api/v1/posts')
				.send(post)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(4);
					res.body.error.should.have.property('message').eql('Title cannot be empty string');
					done();
				});
		});
	});

	describe('/PATCH/:id post', () => {
		it('should PATCH a post', (done) => {
			let postId = 1;
			let post = {
				author: 'seohyun yoon',
				title: '1st',
				content: '1st content edited',
			};
			chai.request(app)
				.patch('/api/v1/posts/' + postId)
				.send(post)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('data');
					res.body.data.should.have.property('postId').eql('1');
					res.body.data.should.have.property('author').eql('seohyun yoon');
					res.body.data.should.have.property('title').eql('1st');
					res.body.data.should.have.property('content').eql('1st content edited');
					done();
				});
		});

		it('should not PATCH a post if postId is NOT FOUND', (done) => {
			let postId = 3;
			let post = {
				author: 'seohyun yoon',
				title: '1st',
				content: '1st content edited',
			};
			chai.request(app)
				.patch('/api/v1/posts/' + postId)
				.send(post)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(1);
					res.body.error.should.have.property('message').eql(`postID '${postId}' Not found.`);
					done();
				});
		});

		it('should not PATCH a post if title is empty string', (done) => {
			let postId = 1;
			let post = {
				author: 'seohyun yoon',
				title: '',
				content: '1st content edited',
			};
			chai.request(app)
				.patch('/api/v1/posts/' + postId)
				.send(post)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(4);
					res.body.error.should.have.property('message').eql('Title cannot be empty string');
					done();
				});
		})
	})

	describe('/DELETE/:id post', () => {
		it('should DELETE a post', (done) => {
			let postId = 1;
			chai.request(app)
				.delete('/api/v1/posts/' + postId)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('string');
					done();
				});
		});

		it('should not DELETE a post if postId is NOT FOUND', (done) => {
			let postId = 3;
			chai.request(app)
				.delete('/api/v1/posts/' + postId)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(1);
					res.body.error.should.have.property('message').eql(`postID '${postId}' Not found.`);
					done();
				});
		})
	})
});
