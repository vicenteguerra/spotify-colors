<template>
    <div class="colours container">   
        <section class="hero">
            <div class="hero-body">
                <p class="title has-text-white">Your Playlists 🎶</p>
                <p class="subtitle has-text-white">Hola {{ this.user.display_name }}</p>
            </div>
        </section>         
        <div class="columns is-multiline">
            <div v-for="playlist in playlists" :key="playlist.id" class="is-2 column">
                <div class="card has-background-dark"  @click="showPlaylist(playlist.id)">
                    <div :style="{ backgroundColor: playlist.colour, color: getContrastingColor(playlist.colour)}" class="rectangle">
                        <p>{{ playlist.colour }}</p>
                    </div>
                    <div class="card-image">
                        <figure class="image">
                            <img v-if="playlist.images[0]" :src="playlist.images[0].url" alt="Playlist cover">
                        </figure>   
                    </div>
                    <div class="card-content">
                        <div class="content paragraph-wrapper">
                            <p class="paragraph  has-text-white">{{ playlist.name }} </p>  
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
    .rectangle {
        width: 100%;                
    }
    .max-1-lines {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .max-2-lines {
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
    name: 'Colours',
    data: function () {
        return {
            username: null,
            playlists: [],
            user: {

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
                this.user = response.data
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
  