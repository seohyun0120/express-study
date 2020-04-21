const updateTest = {
  title: 'update post',
  content: 'success',
  file: 'same',
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

export default { updateTest, code2Test, code3Test, code4Test }