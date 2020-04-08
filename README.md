# Backend

구현 전에 필요한 내용들을 wiki에 정리해두었습니다. 중간에 정책이 바뀔 수 있어 수시로 업데이트 중입니다. [WIKI](https://wiki.ncsoft.com/pages/viewpage.action?pageId=269737099)



#### 1. 초기 세팅 (2/11 ~ 2/12)

기초적인 세팅을 진행하였고, 구현 단계에서 추가적으로 필요한 것들은 계속 넣으며 진행하고 있습니다.

- TypeScript
  - tsconfig, tslint (tslint-config-airbnb)
- Express
- Nodemon (watch changes && restart when a file changes)
- ts-node (run ts code directly without waiting to be compiled)



#### 2. API 정의하기 (2/12 ~ 2/13)

**Mockup data**를 생성해서 API가 제대로 작동하는지 확인하는 단계입니다.

express app의 port 번호: `8000`

router path: `/api/v1/posts/`



**정의한 API**는 다음과 같습니다.

`const id = req.params`

`const { author, title, content } = req.body`

| HTTP METHOD | request url | description           | Reqeust                |
| ----------- | ----------- | --------------------- | ---------------------- |
| GET         | /           | DB에 있는 전체 글을 조회한다.    |                        |
| GET         | /:id        | 조회한 id에 해당하는 글을 조회한다. | id                     |
| POST        | /           | 새로운 글을 작성한다.          | title, author, content |
| PATCH       | /:id        | 조회한 id에 해당하는 글을 수정한다. | title, content         |
| DELETE      | /:id        | 조회한 id에 해당하는 글을 삭제한다. | id                     |



각 요청에 **성공**하는 경우는 다음과 같은 형태로 응답합니다.

```
{
  "success": true,
  "data": [
    {
      ...
    }
  ]
}
```

각 요청에 **실패**하는 경우는 다음과 같은 형태로 응답합니다.

```
{
  "success": false,
    "error": {
        "code": ERROR_CODE,
        "message": ERROR_MESSAGE
    }
}
```


| request URL  | http status code | ERROR_CODE | ERROR_MESSAGE                           | description                            |
| ------------ | ---------------- | ---------- | --------------------------------------- | -------------------------------------- |
| -            | 500              | 500        | Internal Server Error                   | DB 자체에 문제가 생기는 경우입니다.                  |
| GET /:id     | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 조회할 수 없는 경우입니다. |
| POST         | 400              | 2          | Author and Title cannot be empty string | author와 title이 모두 빈 문자열인 경우입니다.        |
| POST         | 400              | 3          | Author cannot be empty string           | author가 빈 문자열인 경우입니다.                  |
| POST         | 400              | 4          | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   |
| PATCH /:id   | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 수정할 수 없는 경우입니다. |
| PATCH /:id   | 400              | 4          | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   |
| DETELTE /:id | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 삭제할 수 없는 경우입니다. |



#### 3. DB 구축 (2/14, 2/17 ~ 2/18)

실습용 MongoDB의 주소와 포트번호를 부여받았습니다. **dotenv**를 사용하여 `test`, `dev`, `prod` 세 가지 개발 환경으로 나누어 작업을 진행하고 있습니다.

현재 **`MONGO_ADDRESS`**는 세 단계 모두 같으며, **`DB_NAME`**은 **test**와 **post** 2개로 나뉘어있습니다.

test는 테스트 업무에만 사용되는 DB이며, post는 dev와 prod 모두에서 사용되는 DB입니다. (향후 prod용 DB를 만들 예정입니다.)

```
// **.env
MONGO_ADDRESS='___________'
DB_NAME='___'

// mongoose.ts
const DATABASE_URL = `mongodb://${process.env.MONGO_ADDRESS}${process.env.DB_NAME}`;
```



#### 4. express app 모듈로 나누기 (2/19 ~ 2/20)

하나의 파일에 정의되었던 express.js app을 작은 모듈들로 나누어서 독립적으로 실행되게 구조를 바꾸었습니다. mongodb를 먼저 연결한 후, express를 연결할 수 있도록 구성하였습니다.

```
src
|__ loaders
  |__ index.ts
  |__ mongoose.ts
  |__ express.ts
```



#### 5. service, controller로 나누기 (2/21)

**Service**: Client의 요청에 알맞게 MongoDB에서 값을 조회하여, 정해진 형식에 맞춰 값을 반환합니다. (data || error)

**Controller**: service로부터 받은 값(data || error)을 바탕으로 client에게 전달해줍니다.



#### 6. Mocha로 Test Code 작성하기 (2/22, 2/24~2/25)

| request URL  | before                               | test                                                                                               | after   |
| ------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| GET          | connect db, server && create post    | 생성된 글이 조회되는지 확인한다.                                                                                 | db drop |
| getOne       | connect db, server  && create a post | 생성된 글이 조회되는지 확인한다.                                                                                 | db drop |
| POST         | connect db, server                   | 1. invalid request에 따라 글이 생성되지 않는 것을 확인한다. 2. 글이 생성되는지 확인한다.                                       | db drop |
| PATCH /:id   | connect db, server && create a post  | 1. invalid Id로 인해 글이 수정되지 않는 것을 확인한다. 2. invalid request에 따라 글이 수정되지 않는 것을 확인한다. 3. 글이 수정되는지 확인한다. | db drop |
| DETELTE /:id | connect db, server && create a post  | 1. invalid Id로 인해 글이 삭제되지 않는 것을 확인한다. 2. 글이 삭제되는지 확인한다.                                            | db drop |



#### 7. Error Handler Middleware (3/9)

기본 error handler를 정의합니다. **next()**로 오류를 전달하지만, error handler에서 해당 오류를 처리하지 않을 경우, 기본 error handler가 해당 오류를 처리합니다. **(500, Internal Server Error)** 


#### 8. DB 스키마 확장 (3/27)

추가 기능을 위해 기존에 있던 DB의 스키마를 변경했다. 변경된 내용은, `viewNum` field가 추가되었고, `comments` field가 추가되었다. 하나의 글에 여러 개의 댓글을 가질 수 있는 one-to-many relation 구조이다. 이를 위해 Embedded Document pattern을 사용했다.

변경된 스키마는 다음과 같다.
```
{
  _id: string;
  title: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  viewNum: number;
  comments: [
    {
      _id: string;
      author: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ]
}
```

#### 9. 댓글 기능으로 인한 API 추가 개발 (3/30 ~ 4/1)

| HTTP METHOD | request url | description           | Reqeust                |
| ----------- | ----------- | --------------------- | ---------------------- |
| PATCH        | /:id/comments           | 새로운 댓글을 생성한다.    | id, author, text  |
| PATCH        | /:id/comments/:commentId        | id로 글을 조회하고, commentId로 해당 댓글을 수정한다. | id, commentId, text |
| DELETE      | /:id /comments/:commentId       | id로 글을 조회하고, commentId로 해당 댓글을 삭제한다. | id, commentId  |

#### 10. Validation

기존의 폼은 비어있는 문자열일 경우에만 에러를 보여줬다. 하지만, 공백으로만 이루어진 문자열을 입력할 경우를 고려하지 않았기 때문에 조건을 추가해주었다. isEmptyOrSpace() 함수를 통해 폼 유효성 검사를 진행한다.

