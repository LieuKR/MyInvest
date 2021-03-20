작업 내용을 기록하기 위한 MD파일입니다.
커밋 전 수정된 내용을 이 파일에 기록하고, 같이 커밋할 예정입니다.

### 유저 아이디, 비밀번호 등 테이블 생성
- Mysql DB에 회원관리를 위한 테이블 추가
    - myinvest 스키마 안에 users 테이블 생성
    - myinvest 스키마는 db_main으로 표현됨
    - no : int AI PK, id : 아이디. varchar(30), password : 암호화된 비밀번호. char(128) , email : 이메일 주소. varchar(50), name : 닉네임용. varchar(30)