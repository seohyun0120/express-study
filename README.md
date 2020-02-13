# Backend

#### 1. 초기 세팅하기

- TypeScript
  - tsconfig, tslint (tslint-config-airbnb)
- Express
- Nodemon (watch changes && restart when a file changes)
- ts-node (run ts code directly without waiting to be compiled)

#### 2. API 정의하기 

- **MockupData 생성**

- **/GET post**
  
  **성공**
  
  - [200] show MockupData
  
  **실패**
  
  - [500] Internal Server Error
  
- **/GET/:id post**
  
  **성공**
  
  - [200] show a data
  
  실패
  
  - [404] [1] postId not found
  - [500] Internal Server Error

- **/POST post**

  **성공**

  - [201] show MockupData

  **실패**

  - [404] [2] title, author are empty string
  - [404] [3] author is empty string
  - [404] [4] title is empty string
  - [500] Internal Server Error

- **/PATCH/:id post**

  **성공**

  - [201] show MockupData

  **실패**

  - [404] [1] postId not found
  - [404] [4] title is empty string

- **/DELETE/:id post**

  **성공**

  - [200] 

  **실패**

  - [404] [1] postId not found