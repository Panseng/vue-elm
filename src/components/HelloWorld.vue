<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <span v-for="item in hotcity" :key="item.id">
      {{ item.name }}
    </span>
    <br />
    <div v-for='(value, key) in groupcity' :key="key">
      <div>{{ key }}
        <span v-for="item in value" :key="item.id">
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { groupcity, hotcity } from '@/service/getData'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      hotcity: [],
      groupcity: []
    }
  },
  mounted () {
    hotcity().then(data => {
      this.hotcity = data
    })

    groupcity().then(data => {
      this.groupcity = data
    })
    /**
     * fetch('/v1/cities?type=hot')
      .then(response => response.json())
      .then(data => {
        this.str = data
      })
     */
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
