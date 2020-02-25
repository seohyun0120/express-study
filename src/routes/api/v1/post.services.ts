import { isNull, map, omit } from 'lodash';
import { PostModel } from '../../../models/post';
import { IPostMongooseResult, IPostResult, IPost } from '../../../../src/Interfaces/IPost';

const getPosts = async (query: object) => {
  const posts: IPostMongooseResult[] = await PostModel.find(query).lean();
  const result: IPostResult[] = map(posts, (p) => omit(p, '__v'));
  return result;
}

const getPost = async (id: string) => {
  const post: IPostMongooseResult = await PostModel.findById(id).lean();

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  }

  const result: IPostResult = omit(post, '__v');
  return result;
}

const createPost = async (
  author: string,
  title: string,
  content?: string
) => {
  if (author === '' && title === '') {
    throw [400, false, 2, 'Author and Title cannot be empty string'];
  } else if (author === '') {
    throw [400, false, 3, 'Author cannot be empty string'];
  } else if (title === '') {
    throw [400, false, 4, 'Title cannot be empty string'];
  }

  const post: IPost = await PostModel.create({ title, author, content });
  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const updatePost = async (id: string, title: string, content?: string) => {
  const post: IPost = await PostModel.findByIdAndUpdate(id, {
    title,
    content
  }, { new: true });

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  } else if (title === '') {
    throw [400, false, 4, 'Title cannot be empty string'];
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const deletePost = async (id: string) => {
  const post: IPost = await PostModel.findByIdAndDelete(id);

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
