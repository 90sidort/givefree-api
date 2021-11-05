# Givefree backend
Api for [frontend app](https://github.com/90sidort/givefree-ui). Api tests missing, will be added soon.  

Steps to run this project:

1. Click Code button
2. Select SSH
3. Copy text
4. Run IDE (e.g. VS Code)
5. Run bash terminal
6. Type `git clone` and paste copied text
7. Create new file in root directory named ".env.dev"
8. Create new file in root directory named ".env.test"
9. Copy content of ".env.dev.example" to your ".env.dev" file
10. Copy content of ".env.test.example" to your ".env.test" file
11. Type `docker-compose up --build` in terminal
12. After containers are up open new terminal
13. Type `docker ps`
14. Copy id of givefree-api_web container
15. Type `docker exec -it <here goes copied id> bash`
16. Type npm run fixtures
17. Wait until Loaded message is logged
18. Go to 'http://localhost:4000/graphql'
19. Try to log in with user: admin, password: testtest2
