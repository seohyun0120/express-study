import chai from 'chai';
import chaiHttp from 'chai-http';
import { Db } from 'mongodb';
import express, { Application } from 'express';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import testParams from './testData';
import testData from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let id: string = '';
let mongoose: Db;

describe('# PATCH', function () {
  before('connect database & server', async function () {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  after('drop database', async function () {
    await mongoose.dropDatabase();
  });

  describe('## /PATCH/:id post', function () {
    beforeEach('initialize DB && create a post', async function () {
      await mongoose.dropDatabase();
      const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
      id = result.body.data._id;
    });

    const invalidId = id + 'a';
    it('should not PATCH a post if id is invalid', async function () {
      const res = await chai.request(testApp).patch('/api/v1/posts/' + invalidId).send(testData.updateTest);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(1);
      res.body.error.should.have.property('message');
    });

    it('should not PATCH a post if title is empty string', async function () {
      const res = await chai.request(testApp).patch('/api/v1/posts/' + id).send(testData.code4Test);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(false);
      res.body.should.have.property('error');
      res.body.error.should.have.property('code').eql(4);
      res.body.error.should.have.property('message');
    });

    it('should PATCH a post && check if record is PATCHed', async function () {
      const res = await chai.request(testApp).patch('/api/v1/posts/' + id).send(testData.updateTest);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.should.have.property('data');
      res.body.data.should.have.property('_id').eql(id);
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');

      const res2 = await chai.request(testApp).get('/api/v1/posts/' + id);
      res2.should.have.status(200);
      res2.body.should.be.a('object');
      res2.body.should.have.property('isSucceeded').eql(true);
      res2.body.should.have.property('data');
      res2.body.data.should.have.property('_id').eql(id);
      res2.body.data.should.have.property('title').eql(testParams.updateTest.title);
      res2.body.data.should.have.property('content').eql(testParams.updateTest.content);
    });
  });
});