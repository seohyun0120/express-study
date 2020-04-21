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
let mongoose: Db;

describe('# GET ALL', function () {
  before('connect database & server', async () => {
    mongoose = await mongooseLoader();
    await expressLoader(testApp);
  });

  before('create a post with file', async () => {
    await chai.request(testApp)
      .post('/api/v1/posts')
      .set('Content-Type', 'applicatioin/x-www-form-urlencoded')
      .field('title', 'create post')
      .field('author', 'tester')
      .field('content', 'success')
      .attach('file', fs.readFileSync('./assets/testImage.png'), 'testImage.png');
  });

  after('drop database', async () => {
    await mongoose.dropDatabase();
  });

  describe('## /GET post', function () {
    it('should GET one post', async () => {
      const res = await chai.request(testApp).get('/api/v1/posts/');
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('isSucceeded').eql(true);
      res.body.data.should.have.property('totalCount').eql(1);
      res.body.data.should.have.property('page');
      res.body.data.should.have.property('limit');
      res.body.data.should.have.property('posts').with.lengthOf(1);
      res.body.data.posts.should.be.a('array');
      res.body.data.posts[0].should.have.property('author');
      res.body.data.posts[0].should.have.property('title');
      res.body.data.posts[0].should.have.property('content');
      res.body.data.posts[0].should.have.property('viewNum');
      res.body.data.posts[0].should.have.property('comments');
      res.body.data.posts[0].should.have.property('fileId');
    });
  });
});