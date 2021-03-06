import chai from 'chai';
import chaiHttp from 'chai-http';
import { Db } from 'mongodb';
import express, { Application } from 'express';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import testParams from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let mongoose: Db;
let id: string = '';
let commentId: string = '';

describe('# DELETE', function () {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /PATCH/:id/comments comment', function () {
    beforeEach('initialize DB && create a post && create a comment', async () => {
      await mongoose.dropDatabase();
      const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
      id = result.body.data._id;
      const result2 = await chai.request(testApp).patch('/api/v1/posts/' + id + '/comments').send(testParams.createCommentTest);
      commentId = result2.body.data.comments[0]._id;
    });

    const invalidCommentId = id + 'a';
    it('should not DELETE a comment if commentId is invalid', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + id + '/comments/' + invalidCommentId);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(7);
      res.body.error.should.have.property('message');
    });

    it('should DELETE a comment && check if record is DELETEd', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + id + '/comments/' + commentId);
      res.should.have.status(200);
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.should.have.property('data');
      res.body.data.should.have.property('_id').eql(id);
      res.body.data.should.have.property('comments').that.is.empty;

      const res2 = await chai.request(testApp).get('/api/v1/posts/' + id);
      res2.should.have.status(200);
      res2.body.should.be.a('object');
      res2.body.should.have.property('isSucceeded').eql(true);
      res2.body.data.should.have.property('_id').eql(id);
      res2.body.data.should.have.property('comments').that.is.empty;
    });
  });
});