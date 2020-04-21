const createTest = {
  author: 'tester',
  title: 'create post',
  content: 'success',
  file: 'same',
}

const createCommentTest = {
  author: 'tester2',
  text: 'create comment'
}

const updateTest = {
  title: 'update post',
  content: 'success',
  file: 'same',
}

const updateCommentTest = {
  text: 'update comment'
}

const code2Test = {
  author: '          ',
  title: '',
  content: 'code 2 error',
  file: 'same'
}

const code3Test = {
  author: '       ',
  title: 'error 3',
  content: 'code 3 error',
  file: 'same'
}

const code4Test = {
  author: 'tester',
  title: '       ',
  content: 'code 4 error',
  file: 'same'
}

const code6Test = {
  text: '     ',
}

export default { createTest, createCommentTest, updateTest, updateCommentTest, code2Test, code3Test, code4Test, code6Test }