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

| request url | HTTP METHOD | description           | Reqeust                |
| ----------- | ----------- | --------------------- | ---------------------- |
| GET         | /           | DB에 있는 전체 글을 조회한다.    |                        |
| GET         | /:id        | 조회한 id에 해당하는 글을 조회한다. | id                     |
| POST        | /           | 새로운 글을 작성한다.          | title, author, content |
| PATCH       | /:id        | 조회한 id에 해당하는 글을 수정한다. | title, content         |
| DELETE      | /:id        | 조회한 id에 해당하는 글을 삭제한다. | id                     |



각 요청에 따라 실패하는 케이스들에 대한 **error**는 다음과 같이 정의하였습니다. 

```
{
    error: {
        code: ERROR_CODE,
        message: ERROR_MESSAGE
    }
}
```


| request url  | http status code | ERROR_CODE | ERROR_MESSAGE                           | description                            |
| ------------ | ---------------- | ---------- | --------------------------------------- | -------------------------------------- |
| -            | 500              | 500        | Internal Server Error                   | DB 자체에 문제가 생기는 경우입니다.                  |
| GET /:id     | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 조회할 수 없는 경우입니다. |
| POST         | 400              | 2          | Author and Title cannot be empty string | author와 title이 모두 빈 문자열인 경우입니다.        |
| POST         | 400              | 3          | Author cannot be empty string           | author가 빈 문자열인 경우입니다.                  |
| POST         | 400              | 4          | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   |
| PATCH /:id   | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 수정할 수 없는 경우입니다. |
| PATCH /:id   | 400              | 4          | Title cannot be empty string            | title이 빈 문자열인 경우입니다.                   |
| DETELTE /:id | 404              | 1          | postID '${postId}' Not found            | 조회한 id에 해당하는 글이 DB에 없어 삭제할 수 없는 경우입니다. |



#### 3. DB 구축 (2/14 ~ 2/18)

실습용 MongoDB의 주소와 포트번호를 부여받았습니다. **dotenv**를 사용하여 `test`, `dev`, `prod` 세 가지 개발 환경으로 나누어 작업을 진행하고 있습니다. 현재 `MONGO_ADDRESS`는 세 단계 모두 같으며, `DB_NAME`은 **test**와 **post** 2개로 나뉘어있습니다.  test는 테스트 업무에만 사용되는 DB이며, post는 dev와 prod 모두에서 사용되는 DB입니다. (향후 prod용 DB를 만들 예정입니다.)

```
// .env

MONGO_ADDRESS='___________'
DB_NAME='____'
```



#### 4. dotenv로 환경 변수 설정하기 (2/19)

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



#### 5. express app 모듈로 나누기 (2/20 ~ 2/21)

하나의 파일에 정의되었던 express.js app을 작은 모듈들로 나누어서 독립적으로 실행되게 구조를 바꾸었습니다. mongodb를 먼저 연결한 후, express를 연결할 수 있도록 구성하였습니다.

```
src
|__ loaders
	|__ index.ts
	|__ mongoose.ts
	|__ express.ts
```



#### 6. service, controller로 나누기 (2/21)

**Service**: Client의 요청에 알맞게 MongoDB에서 값을 조회하여, 정해진 형식에 맞춰 값을 반환합니다. (data || error)

**Controller**: service로부터 받은 값(data || error)을 바탕으로 client에게 전달해줍니다.





