import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Db } from 'mongodb';
import express, { Application } from 'express';
import mongooseLoader from '../src/loaders/mongoose';
import expressLoader from '../src/loaders/express';

chai.use(chaiHttp);
chai.should();

const testApp: Application = express();
let id: string = '';
let mongoose: Db;

describe('# DELETE', function () {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /DELETE post', async () => {
    beforeEach('initialize DB && create a post', async () => {
      await mongoose.dropDatabase();
      const result = await chai.request(testApp)
        .post('/api/v1/posts')
        .set('Content-Type', 'applicatioin/x-www-form-urlencoded')
        .field('title', 'create post')
        .field('author', 'tester')
        .field('content', 'success')
        .attach('file', fs.readFileSync('./assets/testImage.png'), 'testImage.png');
      id = result.body.data._id;
    });

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

    it('should DELETE a post && check if record is DELETEd', async () => {
      const res = await chai.request(testApp).delete('/api/v1/posts/' + id);
      res.should.have.status(200);
      res.body.should.have.property('data');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('_id');
      res.body.data.should.have.property('author');
      res.body.data.should.have.property('title');
      res.body.data.should.have.property('content');
      res.body.data.should.have.property('viewNum');
      res.body.data.should.have.property('fileId');

      const res2 = await chai.request(testApp).delete('/api/v1/posts/' + id);
      res2.should.have.status(404);
      res2.body.should.be.a('object');
      res2.body.should.have.property('isSucceeded').eql(false);
      res2.body.should.have.property('error');
      res2.body.error.should.have.property('code');
      res2.body.error.should.have.property('message');
    });
  });
});