import { PostModel } from '../../../models/post';
import { isNull, map, omit } from 'lodash';

const getPosts = async (query: object) => { 
  const posts = await PostModel.find(query).lean();
  const result = map(posts, (p) => omit(p, '__v'));
  return result;
}

const getPost = async (id: string) => {
  const post = await PostModel.findById(id).lean();

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  }

  const result = omit(post, '__v');
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

  const post = await new PostModel({
    title, author, content
  }).save();

  const result = omit(post.toObject(), '__v');
  return result;
}

const updatePost = async (id: string, title: string, content?: string) => {
  const post = await PostModel.findByIdAndUpdate(id, {
    title,
    content
  }, { new: true });

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  } else if (title === '') {
    throw [400, false, 4, 'Title cannot be empty string'];
  }

  const result = omit(post, '__v');
  return result;
}

const deletePost = async (id: string) => {
  const post = await PostModel.findByIdAndDelete(id);

  if (isNull(post)) {
    throw [404, false, 1, `postId '${id} Not found.`];
  }

  return post;
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
