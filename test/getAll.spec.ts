import chai from 'chai';
import chaiHttp from 'chai-http';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import express, { Application } from 'express';
import testData from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();

describe('# GET ALL', () => {
  before('connect database & server', async () => {
    await mongooseLoader();
    await expressLoader(testApp);
  });

  before('create a post', async () => {
    await chai.request(testApp).post('/api/v1/posts').send(testData.createTest);
  });

  describe('## /GET post', () => {
    it('should GET one post', async () => {
      await chai.request(testApp)
        .get('/api/v1/posts/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('isSucceeded').eql(true);
          res.body.should.have.property('data').with.lengthOf(1);
          res.body.data.should.be.a('array');
          res.body.data[0].should.have.property('author').eql(testData.createTest.author);
          res.body.data[0].should.have.property('title').eql(testData.createTest.title);
          res.body.data[0].should.have.property('content').eql(testData.createTest.content);
        });
    });
  });

  after('drop database', async () => {
    await (await mongooseLoader()).dropDatabase();
  })
})