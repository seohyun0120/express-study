import { ICreatePost, IUpdatePost } from "../src/interfaces/IPost";

const createTest: ICreatePost = {
  author: 'tester',
  title: 'create post',
  content: 'success'
}

const updateTest: IUpdatePost = {
  title: 'update post',
  content: 'success'
}

const code2Test: ICreatePost = {
  author: '',
  title: '',
  content: 'code 2 error'
}

const code3Test: ICreatePost = {
  author: '',
  title: 'error 3',
  content: 'code 3 error'
}

const code4Test: ICreatePost = {
  author: 'tester',
  title: '',
  content: 'code 4 error'
}

export default { createTest, updateTest, code2Test, code3Test, code4Test }