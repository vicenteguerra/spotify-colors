<template>
    <div class="colours">    
        <h1>Colours 🎶</h1>
        <h2>Hola {{ this.username }}</h2>
        <div id="playlists-container">
            <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card">
                <div :style="{ backgroundColor: playlist.colour }" class="rectangle"></div>
                <img v-if="playlist.images[0]" :src="playlist.images[0].url" alt="Playlist cover" width="100" height="100">
                <p @click="showPlaylist(playlist.id)">{{ playlist.name }}</p>                
                <p>Color {{ playlist.colour }}</p>
            </div>
        </div>


    </div>
  </template>

  <style>
    #playlists-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .playlist-card {
        flex: 1 0 200px; /* Este valor determina el tamaño mínimo de las tarjetas. Ajusta como necesites. */
        margin: 10px;   /* Este valor determina el espacio entre las tarjetas. Ajusta como necesites. */
        /* Aquí puedes agregar más estilos para tus tarjetas, como el borde, el sombreado, etc. */
    }
    .rectangle {
        width: 100%;
        height: 20px;
        margin-bottom: 10px;
    }
  </style>
  
  <script>  
  
  import axios from 'axios'
  import { average } from 'color.js'
  
  export default {
    name: 'Colours',
    data: function () {
        return {
            username: null,
            playlists: []
        }
    },
    methods: {
        showPlaylist(id){
            this.$router.push({ name: 'Playlist', params: { playlistId: id } });
        },
        calcColours(url){
            return new Promise((resolve, reject) => {
                average(url, { format: 'hex' }).then(color => {
                    console.log("COLOR: ", color)
                    return resolve(color);
                });
            })
        },
        getMe: async function(){
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.accessToken}`
                }
            }).then((response) => {
                console.log("ME DATA", response.data)
                this.username = response.data.id
            })
        },
        getPlaylists: async function(){
            axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${this.$store.state.accessToken}`
            }
            })
            .then(async response => {
                console.log(response.data);  // Aquí están tus playlists
                this.playlists = response.data.items;  
                for(let i=0; i< this.playlists.length; i++){
                    this.playlists[i].colour = await this.calcColours(this.playlists[i].images[0].url);   
                }

                console.log("PLAYLIST", this.playlists)
            })
            .catch(error => {
                console.error(error);
            });
        }
    },
    async mounted() {    
        console.log ("STORE", this.$store.state)   
        this.getMe();
        this.getPlaylists()
    }
  }
  </script>
  