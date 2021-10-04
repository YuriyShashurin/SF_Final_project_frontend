<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="main-wrap mb-3 d-flex flex-row flex-wrap row"
         style="min-height: 100%;">
      <div class="d-flex flex-column align-items-center col-md-2" id="nav"
           style="height: 100%; position: fixed; min-width: 13%">
        <img alt="Our logo" id="logo" src="./assets/logo.png">
        <div v-if="!$store.state.username" class="d-flex flex-column align-items-center">
          <router-link style="width: 100%" class="mt-3 mb-2" to="/login">
            <button style="width: 100%" class="btn btn-info text-white text-uppercase">
              Вход
            </button>
          </router-link>
          <router-link class="mb-4" to="/signup">или зарегистрируйтесь</router-link>
          <router-link class="mb-3" to="/">Главная</router-link>
        </div>
        <div v-else class="mb-4 d-flex flex-column align-items-center">
          <h3>{{ $store.state.username }}</h3>
          <div v-if="$store.state.isStaff === true">
            <span class="badge rounded-pill bg-primary text-white">Администратор</span>
          </div>
          <div v-else>
            <span class="badge rounded-pill bg-primary text-white">Работник</span>
          </div>
          <small class="mb-4">
            <router-link to="/logout">
              Выйти
            </router-link>
          </small>
          <div v-if="$store.state.isStaff === false" class="d-flex flex-column align-items-center">
            <router-link class="mb-3" to="/user_area/surveys">Доступные опросы</router-link>
            <router-link class="mb-3" to="/user_area/stats">Статистика</router-link>
          </div>
          <div v-else class="d-flex flex-column align-items-center">
            <router-link class="mb-3" to="/admin-area/main">Список проектов</router-link>
            <router-link class="mb-3" to="/admin-area/users">Пользователи</router-link>
            <router-link class="mb-3" to="/admin-area/questions">Шаблонные Вопросы</router-link>
          </div>
          <footer class="footer d-flex flex-column">
            <div class="d-flex flex-row justify-content-between">
              <div class="d-flex flex-column">
                <h5 class="text-white">Frontend</h5>
                <small class="text-white mb-3">Vue.js/VueX</small>
                <a href="https://github.com/YuriyShashurin/SF_Final_project_frontend.git">
                  <img alt="Frontend" id="github1" width="30" height="30"
                       src="./assets/free-icon-github-sign-25657.png">
                </a>
              </div>
              <div class="d-flex flex-column">
                <h5 class="text-white">Backend</h5>
                <small class="text-white mb-3">Django3 / API - DRF</small>
                <a href="https://github.com/YuriyShashurin/SF_Final_project_backend.git">
                  <img alt="Frontend" id="github2" width="30" height="30"
                       src="./assets/free-icon-github-sign-25657.png">
                </a>
              </div>
            </div>
            <div class="mt-3">
              <a href="https://github.com/YuriyShashurin?tab=repositories" style="color: #ED7D31" class="font-weight-bold">
                @YuriyShashurin
              </a>
              <p class="text-white font-weight-bold">&#169; 2021</p>
            </div>
          </footer>
        </div>
      </div>
      <main class="main-block-size col-md-10 offset-md-2" style="height: 95%; min-width: 70%">
        <header class="d-flex header mb-2">
          <h5>Главная</h5>
        </header>
        <router-view/>
      </main>
    </div>

  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 98vh;
}

html {
  margin: 0px;
  height: 100%;
  width: 100%;
}

body {
  padding: 1% 2% 0 2%;
  margin: 0px;
  height: 100%;
  width: 100%;
}

#nav {
  padding: 5px 10px;
  background-color: antiquewhite;
  min-height: 100%;

}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  /*color: #42b983;*/
  color: #ED7D31;
}

#logo {
  max-width: 100%;
  max-height: 150px;
}

.header {
  border-bottom: solid 4px #ED7D31;
  padding: 1em 0em 1em 1em;

}

.footer {
  background-color: #2c3e50;
  position: absolute;
  bottom: 0;
  padding: 10px;
  width: 100%;
  min-height: 20%;
  opacity: 80%;
}
</style>
