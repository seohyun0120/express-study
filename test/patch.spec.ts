import chai from 'chai';
import chaiHttp from 'chai-http';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import express, { Application } from 'express';
import testParams from './testData';
import testData from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let id: string = '';

describe('# PATCH', () => {
	before('connect database & server', async () => {
		await mongooseLoader();
		await expressLoader({ app: testApp });
	});

	before('create a post', async () => {
		const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
		id = result.body.data._id;
	});

	describe('## /PATCH/:id post', () => {
		const invalidId = id + 'a';
		it('should not PATCH a post if id is invalid', (done) => {
			chai.request(testApp)
				.patch('/api/v1/posts/' + invalidId)
				.send(testData.updateTest)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('isSucceeded').eql(false);
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(1);
					res.body.error.should.have.property('message').eql(`postId '${invalidId} is Not Found`);
					done();
				});
		});

		it('should not PATCH a post if title is empty string', (done) => {
			chai.request(testApp)
				.patch('/api/v1/posts/' + id)
				.send(testData.code4Test)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('isSucceeded').eql(false);
					res.body.should.have.property('error');
					res.body.error.should.have.property('code').eql(4);
					res.body.error.should.have.property('message').eql('Title cannot be empty string');
					done();
				});
		});

		it('should PATCH a post', (done) => {
			chai.request(testApp)
				.patch('/api/v1/posts/' + id)
				.send(testData.updateTest)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('isSucceeded').eql(true);
					res.body.should.have.property('data');
					res.body.data.should.have.property('_id').eql(id);
					res.body.data.should.have.property('title').eql(testData.updateTest.title);
					res.body.data.should.have.property('content').eql(testData.updateTest.content);
					done();
				});
		});
	});

	after('drop database', async () => {
		await (await mongooseLoader()).dropDatabase();
	});
})