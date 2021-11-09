# SF_Final_project_Frontend
## Frontend выпускного проект курса "Веб-разработчик на Python" от онлайн-школы SkillFactory - веб-сайт для внутренних опросов HR Tech

## Backend проекта в GitHub
```
https://github.com/YuriyShashurin/SF_Final_project_backend.git
```

### Stack backend проекта:

* Vue3 + Vuex


### FullStack проект развернут на публичном IP по адресу 

* Сайт проекта http://178.154.200.34
* Личный кабинет администратора http://178.154.200.34/#/admin-area/main
* API проекта http://178.154.200.34/api/v1/
* Документация проекта http://178.154.200.34/docs/



### Как развернуть проект локально

#### 1. Cклонировать данный репозиторий

```
git clone https://github.com/YuriyShashurin/SF_Final_project_fronend.git
```

#### 2. Перейти в папку проекта

```
cd SF_Final_project_fronend
```

#### 3. Проверить установку node.js. Если он не установлен, провести его установку. 

```
node --version - узнать версию установленного node
https://nodejs.org/en/ - установка node.js
```

#### 4. Запустить в консоли команду для запуска dev-сервера vue.js

```
npm run serve
```
#### 5. Перейти по адресу http://localhost:8080/



### Как развернуть проект через Docker (для Windows)

#### 1. Выполнить пункты 1-2 из описания выше

#### 2. Создать в консоли из папки проекта образ контейнера
```
docker build -t vuejs:v0.1 .
```

#### 3. Запустить в консоли из папки проекта образ контейнера
```
docker run -p 8080:8080 vuejs:v0.1
```

#### 4. Перейти по адресу http://localhost:8080/

