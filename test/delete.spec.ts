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
let id: string = '';
let mongoose: Db;

describe('# DELETE', () => {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  before('create a post', async () => {
    const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
    id = result.body.data._id;
  });

  describe('## /DELETE post', async () => {
    const invalidId = id + 'a';
    it('should not DELETE a post if id is invalid', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + invalidId);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code');
      res.body.error.should.have.property('message');
    });

    it('should DELETE a post', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + id);
      res.should.have.status(200);
      res.body.should.have.property('data');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('_id');
      res.body.data.should.have.property('author');
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');
    });

    it('should GET 404 after DELETE a post', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + invalidId);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code');
      res.body.error.should.have.property('message');
    });
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });
});