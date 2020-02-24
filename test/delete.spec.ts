import chai from 'chai';
import chaiHttp from 'chai-http';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';
import express, { Application } from 'express';
import testParams from './testData';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let id: string = '';

describe('# DELETE', () => {
  before('connect database & server', async () => {
    await mongooseLoader();
    await expressLoader({ app: testApp });
  });

  before('create a post', async () => {
    const result = await chai.request(testApp).post('/api/v1/posts').send(testParams.createTest);
    id = result.body.data._id;
  });

  describe('## /DELETE post', () => {
    const invalidId = id + 'a';
    it('should not DELETE a post if id is invalid', (done) => {
      chai.request(testApp)
        .delete('/api/v1/posts/' + invalidId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('isSucceeded').eql(false);
          res.body.should.have.property('error');
          res.body.error.should.have.property('code').eql(1);
          res.body.error.should.have.property('message').eql(`postId '${invalidId} is Not Found`);
          done();
        });
    });

    it('should DELETE a post', (done) => {
      chai.request(testApp)
        .delete('/api/v1/posts/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.should.have.property('isSucceeded').eql(true);
          res.body.data.should.have.property('_id').eql(id);
          res.body.data.should.have.property('author').eql(testParams.createTest.author);
          res.body.data.should.have.property('title').eql(testParams.createTest.title);
          res.body.data.should.have.property('content').eql(testParams.createTest.content);
          done();
        });
    });
  });

  after('drop database', async () => {
    await (await mongooseLoader()).dropDatabase();
  });
})