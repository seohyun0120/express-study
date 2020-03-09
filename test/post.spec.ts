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

describe('# POST', function () {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /POST/:id post', function () {
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

    it('should CREATE a post && check if record is CREATEd', async () => {
      const res = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
      const id = res.body.data._id;
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('author');
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');

      const res2 = await chai.request(testApp).get('/api/v1/posts/' + id);
      res2.should.have.status(200);
      res2.body.should.be.a('object');
      res2.body.should.have.property('isSucceeded').eql(true);
      res2.body.should.have.property('data');
      res2.body.data.should.have.property('_id').eql(id);
      res2.body.data.should.have.property('title');
      res2.body.data.should.have.property('content');
    });
  });
});