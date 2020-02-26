import chai from 'chai';
import chaiHttp from 'chai-http';
import { Db } from 'mongodb';
import express, { Application } from 'express';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import testData from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let mongoose: Db;

describe('# GET ALL', () => {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  before('create a post', async () => {
    await chai.request(testApp).post('/api/v1/posts').send(testData.createTest);
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /GET post', () => {
    it('should GET one post', async () => {
      const res = await chai.request(testApp).get('/api/v1/posts/');
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.should.have.property('data').with.lengthOf(1);
      res.body.data.should.be.a('array');
      res.body.data[0].should.have.property('author');
      res.body.data[0].should.have.property('title');
      res.body.data[0].should.have.property('content');
    });
  });
});