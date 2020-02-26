import chai from 'chai';
import chaiHttp from 'chai-http';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import express, { Application } from 'express';
import testParams from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();

describe('# POST', () => {
  before('connect database & server', async () => {
    await mongooseLoader();
    await expressLoader(testApp);
  });

  describe('## /POST/:id post', () => {
    it('should not POST a post if title and author are empty string', async () => {
      await chai.request(testApp)
        .post('/api/v1/posts')
        .send(testParams.code2Test)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('isSucceeded').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.have.property('code').eql(2);
          res.body.error.should.have.property('message');
        });
    });

    it('should not POST a post if author is empty string', async () => {
      await chai.request(testApp)
        .post('/api/v1/posts')
        .send(testParams.code3Test)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('isSucceeded').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.have.property('code').eql(3);
          res.body.error.should.have.property('message');
        });
    });

    it('should not POST a post if title is empty string', async () => {
      await chai.request(testApp)
        .post('/api/v1/posts')
        .send(testParams.code4Test)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('isSucceeded').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.have.property('code').eql(4);
          res.body.error.should.have.property('message');
        });
    });

    it('should CREATE a post', async () => {
      await chai.request(testApp)
        .post('/api/v1/posts')
        .send(testParams.createTest)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('isSucceeded').eql(true);
          res.body.should.have.property('author');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
        });
    });
  });

  after('drop database', async () => {
    await (await mongooseLoader()).dropDatabase();
  });
})