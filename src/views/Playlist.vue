<template>
    <div class="playlist">    
        <h2>{{ this.playlist.name }} </h2>
        <div id="playlists-container">
            <div v-for="item in items" :key="item.track.id" class="playlist-card"> 
                <div :style="{ backgroundColor: item.colour }" class="rectangle"></div>               
                <img v-if="item.track.album.images[0]" :src="item.track.album.images[0].url" alt="Album cover" width="100" height="100">
                <p @click="showSong(item.track.id)" class="trackTitle">{{ item.track.name }}</p>                                
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
  import { average } from 'color.js'
  
  export default {
    name: 'Playlist',
    data: function () {
        return {
            items: [],
            playlist: {
                name: null
            }
        }
    },
    methods: {
        showSong(id){
            this.$router.push({ name: 'Song', params: { songId: id } });
        },
        calcColours(url){
            return new Promise((resolve, reject) => {
                average(url, { format: 'hex' }).then(color => {
                    console.log("COLOR: ", color)
                    return resolve(color);
                });
            })
        },
        getPlaylist: async function(){
            axios.get("https://api.spotify.com/v1/playlists/" + this.$route.params.playlistId, {
            headers: {
                'Authorization': `Bearer ${this.$store.state.accessToken}`
            }
            })
            .then(async response => {
                console.log(response.data);  // Aquí están tus playlists
                this.playlist = response.data;  

                console.log("PLAYLIST", this.playlist)
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
        console.log ("PLAYLIST", this.$route.params.playlistId)  
        this.getPlaylist()
        this.getPlaylistTracks() 
    }
  }
  </script>
  