import { isNull, map, omit } from 'lodash';
import { IPostMongooseResult, IPostResult, IPost } from '../../../Interfaces/IPost';
import { PostModel } from '../../../models/post';
import Exceptions from '../../../exceptions';

const getPosts = async (query: object) => {
  const posts: IPostMongooseResult[] = await PostModel.find(query).lean();
  const result: IPostResult[] = map(posts, (p) => omit(p, '__v'));
  return result;
}

const getPost = async (id: string) => {
  const post: IPostMongooseResult = await PostModel.findById(id).lean();

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
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
    throw new Exceptions.AuthorTitleAreEmptyException();
  } else if (author === '') {
    throw new Exceptions.AuthorIsEmptyException();
  } else if (title === '') {
    throw new Exceptions.TitleIsEmptyException();
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
    throw new Exceptions.PostNotFoundException(id);
  } else if (title === '') {
    throw new Exceptions.TitleIsEmptyException();
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

const deletePost = async (id: string) => {
  const post: IPost = await PostModel.findByIdAndDelete(id);

  if (isNull(post)) {
    throw new Exceptions.PostNotFoundException(id);
  }

  const result: IPostResult = post.toObject({ versionKey: false });
  return result;
}

export default { getPosts, getPost, createPost, updatePost, deletePost };
