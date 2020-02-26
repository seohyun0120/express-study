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

describe('# POST', () => {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  describe('## /POST/:id post', () => {
    it('should not POST a post if title and author are empty string', async () => {
      const res = await chai.request(testApp).post('/api/v1/posts').send(testParams.code2Test);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(2);
      res.body.error.should.have.property('message');
    });

    it('should not POST a post if author is empty string', async () => {
      const res = await chai.request(testApp).post('/api/v1/posts').send(testParams.code3Test);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(3);
      res.body.error.should.have.property('message');
    });

    it('should not POST a post if title is empty string', async () => {
      const res = await chai.request(testApp).post('/api/v1/posts').send(testParams.code4Test);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(4);
      res.body.error.should.have.property('message');
    });

    it('should CREATE a post', async () => {
      const res = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('author');
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');
    });
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });
});