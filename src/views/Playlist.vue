<template>
    <div class="playlist container"> 
        <section class="hero">
            <div class="hero-body">
                <p class="title has-text-white">{{ this.playlist.name }}</p>
            </div>
        </section>     
        <div class="columns is-multiline">
            <div v-for="item in items" :key="item.track.id" class="is-2 column"> 
                <div class="card has-background-dark"  @click="showSong(item.track.id)">
                    <div :style="{ backgroundColor: item.colour, color: getContrastingColor(item.colour)}" class="rectangle">
                        <p>{{ item.colour }}</p>
                    </div>
                    <div class="card-image">
                        <figure class="image">
                            <img v-if="item.track.album.images[0]" :src="item.track.album.images[0].url" alt="Album cover">
                        </figure>   
                    </div>
                    <div class="card-content">
                        <div class="content paragraph-wrapper">
                            <p class="paragraph has-text-white">{{ item.track.name }}</p>  
                        </div>                        
                    </div>
                </div>                                                                      
            </div>
        </div>
    </div>
  </template>

  <style>       
    .paragraph-wrapper {
        height: 2em; /* Ajusta la altura deseada para dos líneas */
        overflow: hidden;
    } 
    .paragraph {
        line-height: 1em; /* Ajusta la altura deseada para una línea */
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
        getContrastingColor(hexColor){
            console.log("GET CONTRASTING", hexColor)
            if(!hexColor) return "black"
            var r = parseInt(hexColor.substr(1, 2), 16); // Obtiene el valor de rojo
            var g = parseInt(hexColor.substr(3, 2), 16); // Obtiene el valor de verde
            var b = parseInt(hexColor.substr(5, 2), 16); // Obtiene el valor de azul

            var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000; // Calcula la luminancia

            return (yiq >= 128) ? 'black' : 'white'; // Devuelve 'black' si la luminancia es alta, 'white' si es baja   
        },  
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
  