<template>
    <div class="song">    
        <h2>{{ this.song.name }}</h2>
        <img v-if="this.song.album.images[0]" :src="this.song.album.images[0].url" alt="Album cover" width="200" height="200">
        <div v-for="colour in this.song.album.colours" class="playlist-card"> 
            <div :style="{ backgroundColor: colour }" class="rectangle"></div>                                                       
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
        flex: 1 0 100px; /* Este valor determina el tamaño mínimo de las tarjetas. Ajusta como necesites. */
        margin: 5px;   /* Este valor determina el espacio entre las tarjetas. Ajusta como necesites. */
        /* Aquí puedes agregar más estilos para tus tarjetas, como el borde, el sombreado, etc. */
    }
    .rectangle {
        width: 100%;
        height: 20px;
        margin-bottom: 10px;
    }
    .trackTitle {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
  </style>
  
  <script>  
  
  import axios from 'axios'
  import { prominent } from 'color.js'
  
  export default {
    name: 'Song',
    data: function () {
        return {
            song: {
                name: null,
                album: {
                    images: [],
                    colours: []
                }
            }
        }
    },
    methods: {
        calcColours(url){
            return new Promise((resolve, reject) => {
                prominent(url, { format: 'hex', amount: 4 }).then(color => {
                    console.log("COLOR: ", color)
                    return resolve(color);
                });                
            })
        },
        getSong: async function(){
            axios.get("https://api.spotify.com/v1/tracks/" + this.$route.params.songId, {
            headers: {
                'Authorization': `Bearer ${this.$store.state.accessToken}`
            }
            })
            .then(async response => {
                console.log(response.data);  // Aquí están tus playlists
                this.song = response.data;  
                this.song.album.colours = await this.calcColours(this.song.album.images[0].url)
                console.log("Song", this.song.album)
            })
            .catch(error => {
                console.error(error);
            });
        },
        getPlaylistTracks: async function(){
            axios.get("https://api.spotify.com/v1/playlists/" + this.$route.params.playlistId + "/tracks", {
            headers: {
                'Authorization': `Bearer ${this.$store.state.accessToken}`
            }
            })
            .then(async response => {
                console.log(response.data);  // Aquí están tus playlists
                this.items = response.data.items;  
                for(let i=0; i< this.items.length; i++){
                    this.items[i].colour = await this.calcColours(this.items[i].track.album.images[0].url);   
                }
                console.log("TRACKS", this.items)
            })
            .catch(error => {
                console.error(error);
            });
        }
    },
    async mounted() {    
        console.log ("Song", this.$route.params.playlistId)  
        this.getSong()
    }
  }
  </script>
  