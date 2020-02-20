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

Mockup data를 생성해서 API가 제대로 작동하는지 확인하는 단계입니다.

express app의 port 번호: `8000`
router path: `/api/v1/posts/`

먼저, 정의한 API는 다음과 같습니다.

| request url | HTTP METHOD | description           |
| ----------- | ----------- | --------------------- |
| /           | GET         | DB에 있는 전체 글을 조회한다.    |
| /:id        | GET         | 조회한 id에 해당하는 글을 조회한다. |
| /           | POST        | 새로운 글을 작성한다.          |
| /:id        | PATCH       | 조회한 id에 해당하는 글을 수정한다. |
| /:id        | DELETE      | 조회한 id에 해당하는 글을 삭제한다. |



각 요청에 따라 실패하는 케이스들에 대한 **error**는 다음과 같이 정의하였습니다. 

```
{
    error: {
        code: ERROR_CODE,
        message: ERROR_MESSAGE
    }
}
```

`const id = req.params`
`const { author, title, content } = req.body`


| request url  | http status code | ERROR_MESSAGE                           | description                            | ERROR_CODE |
| ------------ | ---------------- | --------------------------------------- | -------------------------------------- | ---------- |
| -            | 500              | Internal Server Error                   | DB 자체에 문제가 생기는 경우입니다.                  | 500        |
| GET /:id     | 404              | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 조회할 수 없는 경우입니다. | 1          |
| POST         | 400              | Author and Title cannot be empty string | author와 title이 모두 빈 문자열인 경우입니다.        | 2          |
| POST         | 400              | Author cannot be empty string           | author가 빈 문자열인 경우입니다.                  | 3          |
| POST         | 400              | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   | 4          |
| PATCH /:id   | 404              | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 수정할 수 없는 경우입니다. | 1          |
| PATCH /:id   | 400              | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   | 4          |
| DETELTE /:id | 404              | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 삭제할 수 없는 경우입니다. | 1          |



#### 3. DB 구축 (2/14 ~ 2/18)

MongoDB를 사용합니다.

