<template>
  <div class="row main-wrap mb-5 d-flex flex-wrap">
    <div class="col-2 d-flex flex-column align-items-center" id="nav">
      <img alt="Our logo" id="logo" src="./assets/logo.png">
      <div v-if="!$store.state.user">
        <router-link style="width: 100%" class="mt-3 mb-2" to="/login">
          <button style="width: 100%" class="btn btn-info text-white text-uppercase">
              Ввойдите
          </button>
        </router-link>
        <router-link class="mb-5" to="/signup">или зарегестрируйтесь</router-link>
      </div>
      <div v-else class="mb-4">
        <h3>{{ $store.state.user }}</h3>
        <div v-if="$store.state.isStaff = true">
          <span class="badge rounded-pill bg-primary text-white">Администратор</span>
        </div>
        <div v-else>
          <span class="badge rounded-pill bg-primary text-white">Работник</span>
        </div>
        <small>
          <router-link to="logout">Выйти</router-link>
        </small>

      </div>
      <router-link class="mb-3" to="/">Главная</router-link>
      <router-link class="mb-3" to="/user_area/surveys">Доступные опросы</router-link>
      <router-link class="mb-3" to="/user_area/stats">Статистика</router-link>
    </div>
    <div class="col-10 main-block-size">
      <header class="d-flex header mb-3">
        <h5>Главная</h5>
      </header>
      <router-view/>
    </div>
    <footer class="footer" style="width: 100%">Footer will be here</footer>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  padding: 1% 2%;
}

#nav {
  padding: 5px 10px;
  background-color: #f5f6f7;
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
  padding: 40px;
}
</style>
