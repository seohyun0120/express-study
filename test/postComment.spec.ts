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

describe('# POST', function () {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /POST/:id post', function () {
    before('create a post', async () => {
      const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest)
      id = result.body.data._id;
    });

    it('should CREATE a comment && check if comment is CREATEd', async () => {
      const res = await chai.request(testApp)
        .patch('/api/v1/posts/' + id + '/comments')
        .send(testParams.createCommentTest);

      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('comments').with.lengthOf(1);
      res.body.data.comments.should.be.a('array');
      res.body.data.comments[0].should.have.property('author');
      res.body.data.comments[0].should.have.property('text');

      commentId = res.body.data.comments[0]._id;

      const res2 = await chai.request(testApp).get('/api/v1/posts/' + id);
      res2.should.have.status(200);
      res.body.should.be.a('object');
      res2.body.should.have.property('isSucceeded').eql(true);
      res2.body.should.have.property('data');
      res2.body.data.should.have.property('_id').eql(id);
      res2.body.data.should.have.property('comments').with.lengthOf(1);
      res2.body.data.comments.should.be.a('array');
      res2.body.data.comments[0].should.have.property('author');
      res2.body.data.comments[0].should.have.property('text');
    });
  });
});