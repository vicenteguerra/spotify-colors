<template>
  <section class="has-background-dark hero is-fullheight is-info columns is-flex is-vcentered is-centered">
    <div class="">
      <p class="title">
        Spotify Colours
      </p><br>
      <p class="subtitle">
        Shows the main colour of your favorite album covers
      </p>
      <button class="button is-primary" @click="login()">Login with Spotify</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {    
    login: async function (){
      const clientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
      const redirectUrl = process.env.VUE_APP_BASE_URL + "/callback"
      const scopes = [
          "user-read-playback-state",
          "user-modify-playback-state",
          "user-read-currently-playing",
          "playlist-read-private",
          "playlist-read-collaborative",
          "user-top-read",
          "app-remote-control",
          "streaming",
          "user-read-private", // needed to check if account is free or premium
      ];      
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=${scopes.join(" ")}`                  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
