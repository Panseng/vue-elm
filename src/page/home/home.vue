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
  name: 'home',
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
span{
  font-size: 0.5em
}
</style>
