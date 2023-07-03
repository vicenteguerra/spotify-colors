<template>
    <div class="auth">    
      
    </div>
  </template>
  
  <script>  
  
  import axios from 'axios'
  import qs from 'qs'
  export default {
    name: 'Auth',
    data: function () {
        return {
            accessToken: null
        }
    },
    methods: {
        getMe: async function(){
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            }).then((response) => {
                console.log("ME DATA", response.data)
            })
        }
    },
    async created() {        
        const clientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;
        const redirectUrl = process.env.VUE_APP_BASE_URL + "/callback"
        const code = this.$route.query.code
        
        const data = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUrl,
            client_id: clientId,
            client_secret: clientSecret
        }
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: 'https://accounts.spotify.com/api/token',
        };
        axios(options)
        .then(async (response) => {
            console.log(response.data);
            this.$store.dispatch('setAccessToken', response.data.access_token);
            this.$store.dispatch('setRefreshToken', response.data.refresh_token);    
            this.$router.push({ name: 'Colours' });        
        })
        .catch((error) => {
            console.error(error);
        });
        // Almacenar el token de acceso y utilizarlo para autenticar las solicitudes al API de Spotify
    }
  }
  </script>
  