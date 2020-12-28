# users

## Entities

- [user](#user-entity)

## user Entity

- [x] id
- [x] createdAt
- [x] updatedAt
- [x] createdWith (KAKAO | NAVER | GOOGLE | EMAIL)
- [x] socialId
- [x] email
- [x] password
- [x] nickname (한글: 2 ~ 8자, 영문: 3 ~ 12자)
- [x] gender
- [x] profileImageUrl

#### user CRUD

- [ ] createUserWithEmail (TODO: 자동 로그인 구현)
- [ ] createUserWithOAuth
- [x] getUserById
- [ ] updateUserProfile
- [ ] updatePassword
- [ ] deleteUser
