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

describe('# CREATE', () => {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  before('create a post', async () => {
    const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
    id = result.body.data._id;
  });

  describe('## /GET/:id post', () => {
    const invalidId = id + 'a';
    it('should not GET a post if id is invalid', async () => {
      const res = await chai.request(testApp).get('/api/v1/posts/' + invalidId);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(1);
      res.body.error.should.have.property('message');
    });

    it('should GET a post by the given id', async () => {
      const res = await chai.request(testApp).get('/api/v1/posts/' + id);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.should.have.property('data');
      res.body.data.should.have.property('_id').eql(id);
      res.body.data.should.have.property('author');
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');
    });
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });
});