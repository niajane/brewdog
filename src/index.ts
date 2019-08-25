import Vue from "vue";
import axios from 'axios';
import VueRouter, { RouteConfig, RouterOptions } from 'vue-router';
Vue.use(VueRouter);

/*Home Page Component*/
var Home = Vue.component('home-component',{
  template:`
  <div>
    <div class="hero-image">
        <div class="hero-text">
          <h1>FIND YOUR BEER</h1>
        </div>
    </div>
    <div class="sorting dropdown">
      <button class="dropbtn">SORT</button>
      <div class="dropdown-content" v-bind:class="sortActive">
        <a href='#' v-on:click="sortABVlow()" class="ABVlow">ABV Low to High</a>
        <a href='#' v-on:click="sortABVhigh()" class="ABVhigh">ABV High to Low</a>
        <a href='#' v-on:click="sortDateNew()" class="dateNew">Newest</a>
        <a href='#' v-on:click="sortDateOld()" class="dateOld">Oldest</a>
        <a href='#' v-on:click="sortName()" class="name">Name A-Z</a>
      </div>
    </div>
    <section class="card-container" v-if="loaded">
      <div v-for="n in Math.min(beers.length,numberDisplayed)" v-bind:id="beers[n-1].id" class="card" v-on:click="detail(event.currentTarget)">
        <div v-bind:id="beers[n-1].id">
          <h3 class="card-title"><span>{{beers[n-1].name}}</span></h3>
          <p class="card-abv">{{beers[n-1].abv}}%</p>
          <img v-bind:src="beers[n-1].image_url" height="200" class="card-img">
          <p class="card-tagline">{{beers[n-1].tagline}}</p>
        </div>
      </div>
    </section>
    <div v-else>Loading...</div>
    <button v-if="numberDisplayed<beers.length" v-on:click="loadMore()" class="loadBtn">LOAD MORE</button>
  <div>`,
  data () {
    return{
      beers: [] as any[],
      sortActive: "",
      numberDisplayed: 10,
      loaded: false,
    }
  },
  /*get all beers*/
  created: function () {
    let requests = [] as any[];
    var self = this;
    requests.push(axios.get("https://api.punkapi.com/v2/beers?page=1&per_page=80"));
    requests.push(axios.get("https://api.punkapi.com/v2/beers?page=2&per_page=80"));
    requests.push(axios.get("https://api.punkapi.com/v2/beers?page=3&per_page=80"));
    requests.push(axios.get("https://api.punkapi.com/v2/beers?page=4&per_page=80"));
    requests.push(axios.get("https://api.punkapi.com/v2/beers?page=5&per_page=80"));
    axios.all(requests)
    .then(function(results){
      results.forEach(response => {
        for (let item of response.data){
          self.beers.push(item);
        }
      })
      self.loaded = true;
    });
  },
  methods:{
    /*go to detail page of specific item*/
    detail: function (obj :HTMLElement) {
      this.$router.push({ name:'details', params:{id:obj.id}});
    },
    /*sorts by abv low to high*/
    sortABVlow: function () {
      this.loaded = true;
      this.beers.sort(function(a,b){
        return a.abv - b.abv;
      });
      this.sortActive = 'ABVlow';
      this.numberDisplayed = 10;
    },
    /*sorts by abv low to high*/
    sortABVhigh: function () {
      this.beers.sort(function(a,b){
        return b.abv - a.abv;
      });
      this.sortActive = 'ABVhigh';
      this.numberDisplayed = 10;
    },
    /*sorts by date first brewed new to old*/
    sortDateNew: function () {
      this.beers.sort(function(a,b){
        let aYear = a.first_brewed.substring(3,7);
        let bYear = b.first_brewed.substring(3,7);
        return bYear - aYear;
      });
      this.beers.sort(function(a,b){
        let aYear = a.first_brewed.substring(3,7);
        let bYear = b.first_brewed.substring(3,7);
        let aMonth = a.first_brewed.substring(0,2);
        let bMonth = b.first_brewed.substring(0,2);
        if (aYear == bYear) {
          return bMonth - aMonth
        }
        else {
          return 0;
        }
      });
      this.sortActive = 'dateNew';
      this.numberDisplayed = 10;
    },
    /*sorts by date first brewed old to new*/
    sortDateOld: function () {
      this.beers.sort(function(a,b){
        let aYear = a.first_brewed.substring(3,7);
        let bYear = b.first_brewed.substring(3,7);
        return aYear - bYear;
      });
      this.beers.sort(function(a,b){
        let aYear = a.first_brewed.substring(3,7);
        let bYear = b.first_brewed.substring(3,7);
        let aMonth = a.first_brewed.substring(0,2);
        let bMonth = b.first_brewed.substring(0,2);
        if (aYear == bYear) {
          return aMonth - bMonth
        }
        else {
          return 0;
        }
      });
      this.sortActive = 'dateOld';
      this.numberDisplayed = 10;
    },
    /*sorts by name A-Z*/
    sortName: function () {
      this.beers.sort(function(a,b){
        let aName = a.name.toUpperCase();
        let bName = b.name.toUpperCase();
        return aName.localeCompare(bName);
      });
      this.sortActive = 'name';
      this.numberDisplayed = 10;
    },
    /*loads ten more items*/
    loadMore: function () {
      this.numberDisplayed += 10;
    },
  }
})

/*Random Page Component*/
var Random = Vue.component('random-component',{
  template:`
    <div class="f">
      <div class="hero-image">
          <div class="hero-text">
            <h1>LET FATE FIND IT FOR YOU</h1>
            <button class="random-button" v-on:click="newrandom">Another One!</button>
          </div>
      </div>
      <div>
          <detail-component v-bind:id="randomID"></detail-component>
      </div>
    </div>`,
  data () {
    return{
      randomID: 0,
    }
  },
  /*creates a random ID*/
  created: function () {
    this.randomID = Math.floor(Math.random()*324)+1;
  },
  methods:{
    newrandom: function () {
      this.randomID = Math.floor(Math.random()*324)+1;
    }
  }
});

/*Categories Page Component*/
var Categories = Vue.component('categories-component',{
  template:`
    <div>
      <ul class="cat-menu" v-bind:class='catActive'>
        <li v-on:click="changeCategory('pale')" class='pale'>Pale Ale</li>
        <li v-on:click="changeCategory('ipa')" class='ipa'>IPA</li>
        <li v-on:click="changeCategory('lager')" class='lager'>Lager</li>
        <li v-on:click="changeCategory('wheat')" class='wheat'>Wheat Beer</li>
        <li v-on:click="changeCategory('stout')" class='stout'>Stout</li>
        <li v-on:click="changeCategory('belgian')" class='belgian'>Belgian</li>
        <li v-on:click="changeCategory('pilsner')" class='pilsner'>Pilsner</li>
        <li v-on:click="changeCategory('sour')" class='sour'>Sour Ale</li>
        <li v-on:click="changeCategory('red')" class='red'>Red Ale</li>
        <li v-on:click="changeCategory('porter')" class='porter'>Porter</li>
        <li v-on:click="changeCategory('scotch')" class='scotch'>Scotch</li>
        <li v-on:click="changeCategory('other')" class='other'>Other</li>
      </ul>
      <div class="cat-content">
      <section class="card-container">
      <div v-for="n in Math.min(currentCat.length,numberDisplayed)" v-bind:id="currentCat[n-1].id" class="card" v-on:click="detail(event.currentTarget)">
        <div v-bind:id="currentCat[n-1].id">
          <h3 class="card-title"><span>{{currentCat[n-1].name}}</span></h3>
          <p class="card-abv">{{currentCat[n-1].abv}}%</p>
          <img v-bind:src="currentCat[n-1].image_url" height="200" class="card-img">
          <p class="card-tagline">{{currentCat[n-1].tagline}}</p>
        </div>
        <div v-bind:id="currentCat[n-1].id" class="card-detail" style="display:none">
          <img v-bind:src="currentCat[n-1].image_url" class="detail-img">
          <h3 class="card-title">{{currentCat[n-1].name}}</h3>
          <p class="card-tagline">{{currentCat[n-1].tagline}}</p>
          <p>{{currentCat[n-1].description}}</p>
          <p>{{currentCat[n-1].food_pairing}}</p>
        </div>
      </div>
    </section>
        <button v-if="numberDisplayed<=currentCat.length" v-on:click="loadMore()" class="loadBtn">Load More</button>
      </div>
    </div>`,
  data () {
    return{
      pale: [] as any[],
      ipa: [] as any[],
      lager: [] as any[],
      wheat: [] as any[],
      stout: [] as any[],
      belgian: [] as any[],
      pilsner: [] as any[],
      sour: [] as any[],
      red: [] as any[],
      porter: [] as any[],
      scotch: [] as any[],
      other: [] as any[],
      catActive: "pale",
      numberDisplayed: 10,
    }
  },
  computed: {
    /*change active category*/
    currentCat: function() {
      if (this.catActive == 'pale'){
        return this.pale;
      }
      else if (this.catActive == 'ipa'){
        return this.ipa;
      }
      else if (this.catActive == 'lager'){
        return this.lager;
      }
      else if (this.catActive == 'wheat'){
        return this.wheat;
      }
      else if (this.catActive == 'stout'){
        return this.stout;
      }
      else if (this.catActive == 'belgian'){
        return this.belgian;
      }
      else if (this.catActive == 'pilsner'){
        return this.pilsner;
      }
      else if (this.catActive == 'sour'){
        return this.sour;
      }
      else if (this.catActive == 'porter'){
        return this.porter;
      }
      else if (this.catActive == 'scotch'){
        return this.scotch;
      }
      else if (this.catActive == 'red'){
        return this.red;
      }
      else{
        return this.other;
      }
    }
  },
  created: function () {
    /*get all beers and then sort into categories*/
    for (var i = 1; i<6; i++){
      axios.get("https://api.punkapi.com/v2/beers?page="+i+"&per_page=80")
      .then((response) => {
        let a = response.data;
        for (let item of a){
          if (item.tagline.includes('Pale') || item.description.includes('Pale') || item.name.includes('Pale') || item.tagline.includes('pale') || item.description.includes('pale') || item.name.includes('pale')) {
            this.pale.push(item);
          }
          else if (item.tagline.includes('IPA') || item.description.includes('IPA') || item.name.includes('IPA') || item.tagline.includes('India Pale Ale') || item.description.includes('India Pale Ale') || item.name.includes('India Pale Ale')) {
            this.ipa.push(item);
          }
          else if (item.tagline.includes('Lager') || item.description.includes('Lager') || item.name.includes('Lager') || item.tagline.includes('lager') || item.description.includes('lager') || item.name.includes('lager')) {
            this.lager.push(item);
          }
          else if (item.tagline.includes('Wheat') || item.description.includes('Wheat') || item.name.includes('Wheat') || item.tagline.includes('wheat') || item.description.includes('wheat') || item.name.includes('wheat')) {
            this.wheat.push(item);
          }
          else if (item.tagline.includes('Stout') || item.description.includes('Stout') || item.name.includes('Stout') || item.tagline.includes('stout') || item.description.includes('stout') || item.name.includes('stout')) {
            this.stout.push(item);
          }
          else if (item.tagline.includes('Belgian') || item.description.includes('Belgian') || item.name.includes('Belgian') || item.tagline.includes('belgian') || item.description.includes('belgian') || item.name.includes('belgian')) {
            this.belgian.push(item);
          }
          else if (item.tagline.includes('Pilsner') || item.description.includes('Pilsner') || item.name.includes('Pilsner') || item.tagline.includes('pilsner') || item.description.includes('pilsner') || item.name.includes('pilsner')) {
            this.pilsner.push(item);
          }
          else if (item.tagline.includes('Sour') || item.description.includes('Sour') || item.name.includes('Sour') || item.tagline.includes('sour') || item.description.includes('sour') || item.name.includes('sour')) {
            this.sour.push(item);
          }
          else if (item.tagline.includes('Porter') || item.description.includes('Porter') || item.name.includes('Porter') || item.tagline.includes('porter') || item.description.includes('porter') || item.name.includes('porter')) {
            this.porter.push(item);
          }
          else if (item.tagline.includes('Scotch') || item.description.includes('Scotch') || item.name.includes('Scotch') || item.tagline.includes('scotch') || item.description.includes('scotch') || item.name.includes('scotch')) {
            this.scotch.push(item);
          }
          else if (item.tagline.includes('Red') || item.description.includes('Red') || item.name.includes('Red') || item.tagline.includes('red') || item.description.includes('red') || item.name.includes('red')) {
            this.red.push(item);
          }
          else {
            this.other.push(item);
          }
        }
      })
    }
  },
  methods:{
    /*go to specific detail page*/
    detail: function (obj :HTMLElement) {
      this.$router.push({ name:'details', params:{id:obj.id}});
    },
    /*change active category*/
    changeCategory: function (name: string) {
      this.catActive = name;
      this.numberDisplayed = 10;
    },
    /*show ten more items*/
    loadMore: function () {
      this.numberDisplayed += 10;
    }
  }
})

/*Detail Page Component*/
var Detail = Vue.component('detail-component',{
  props: ['id'],
  template:`
    <div>
      <div class='detail-id' >#{{beer.id}}</div><div class="detail-title">{{beer.name}} </div>
  
      <div class="row">
        <div class="column left">
          <h3>ABV {{beer.abv}}% | IBU {{beer.ibu}} | OG {{beer.target_og}}</h3>
          <h2>FIRST BREWED {{beer.first_brewed}}</h2>
          <h3>BASICS</h3>
          <table class="basics">
            <tr>
              <th>volume</th>
              <td>{{beer.volume.value}}L</td> 
            </tr>
            <tr>
              <th>boil volume</th>
              <td>{{beer.boil_volume.value}}L</td> 
            </tr>
            <tr>
              <th>ABV</th>
              <td>{{beer.abv}}%</td> 
            </tr>
            <tr>
              <th>ABV</th>
              <td>{{beer.abv}}%</td> 
            </tr>
            <tr>
              <th>Target FG</th>
              <td>{{beer.target_fg}}</td> 
            </tr>
            <tr>
              <th>Target OG</th>
              <td>{{beer.target_og}}</td> 
            </tr>
            <tr>
              <th>EBC</th>
              <td>{{beer.ebc}}</td> 
            </tr>
            <tr>
              <th>SRM</th>
              <td>{{beer.srm}}</td> 
            </tr>
            <tr>
              <th>PH</th>
              <td>{{beer.ph}}</td> 
            </tr>
            <tr>
              <th>Attentuation Level</th>
              <td>{{beer.attenuation_level}}</td> 
            </tr>
          </table>

          <h3>METHOD</h3>
            <table class="basics">
              <tr>
                <th>mash temp</th>
                <td>{{beer.method.mash_temp[0].temp.value}} {{beer.method.mash_temp[0].temp.unit}} for {{beer.method.mash_temp[0].duration}}mins</td> 
              </tr>
              <tr>
                <th>fermentation</th>
                <td>{{beer.method.fermentation.temp.value}} {{beer.method.fermentation.temp.unit}}</td> 
              </tr>
              <tr>
                <th>twist</th>
                <td>{{beer.method.twist}}</td> 
              </tr>
            </table>
          
          <h3 class="detail-section-title">BREWER'S TIP</h3>
          <p>{{beer.brewers_tips}}<p>
        </div>

        <div class="column middle"> 
          <img v-bind:src="beer.image_url" class="detail-img"> 
          <br>
          <h3 class="detail-section-title">FOOD PAIRING</h3>
          <ul>
            <li v-for="n in beer.food_pairing.length">
            {{beer.food_pairing[n-1]}}
            </li>
          <ul>
        </div>

        <div class="column right">
          <div class="detail-tagline">{{beer.tagline}}</div>
          <div class="detail-description">{{beer.description}}</div>

          <h3>INGREDIENTS</h3>
          <table class="ingredients">
            <tr>
              <th colspan="4" class="table-header">MALT</th>
            </tr>
            <tr v-for="n in beer.ingredients.malt.length">
              <th colspan="2">{{beer.ingredients.malt[n-1].name}}</th>
              <td colspan="2">{{beer.ingredients.malt[n-1].amount.value}} kg</td>
            </tr>
            <tr>
              <th colspan="4" class="table-header">HOPS</th>
            </tr>
            <tr>
              <th> </th>
              <td>grams</td>
              <td>add</td>
              <td>attribute</td>
            </tr>
            <tr v-for="n in beer.ingredients.hops.length">
                <th>{{beer.ingredients.hops[n-1].name}}</th>
                <td>{{beer.ingredients.hops[n-1].amount.value}}</td>
                <td>{{beer.ingredients.hops[n-1].add}}</td>
                <td>{{beer.ingredients.hops[n-1].attribute}}</td>
            </tr>
            <tr>
              <th colspan="4" class="table-header">YEAST</th>
            </tr>
            <tr>
              <th colspan="4">{{beer.ingredients.yeast}}</th>
            </tr>
          </table>
        </div>

      </div> 
      <h3 style="padding-left:10px">Leftover Ingredients? Try these:</h3>
      <section class="card-container">
        <div v-for="n in threeSimilar.length" v-bind:id="threeSimilar[n-1].id" class="card" v-on:click="detail(event.currentTarget)">
          <div v-bind:id="threeSimilar[n-1].id">
            <h3 class="card-title"><span>{{threeSimilar[n-1].name}}</span></h3>
            <p class="card-abv">{{threeSimilar[n-1].abv}}%</p>
            <img v-bind:src="threeSimilar[n-1].image_url" height="200" class="card-img">
            <p class="card-tagline">{{threeSimilar[n-1].tagline}}</p>
          </div>
        </div>
      </section>

    </div>`,
  data () {
    return{
      /*the beer*/
      beer: {} as any,
      /*three similar beers*/
      threeSimilar: [] as any[]
    }
  },
  watch: {
    /*update page with new beer when prop id changes*/
    id: function() {
      axios.get("https://api.punkapi.com/v2/beers/"+this.id)
      .then((response) => {
        let temp = response.data[0];
        this.beer = temp;
        this.getSimilar();
      }, (error) => {
      })
    }
  },
  created: function () {
    /*get beer*/
    axios.get("https://api.punkapi.com/v2/beers/"+this.id)
    .then((response) => {
      this.beer = response.data[0];
      this.getSimilar();
    }, (error) => {
    })
  },
  methods:{
    /*go to detail page for beer*/
    detail: function (obj :HTMLElement) {
      window.scrollTo(0,0);
      this.$router.push({ name:'details', params:{id:obj.id}});
    },
    /*get three similar beers*/
    getSimilar: function () {
      let requests = [] as any[];
      let similar = [] as any [];
      var self= this;
      self.threeSimilar = [] as any[];
      requests.push(axios.get("https://api.punkapi.com/v2/beers?yeast="+this.beer.ingredients.yeast.replace(" ","_")));
      for (let item of this.beer.ingredients.hops){ 
        requests.push(axios.get("https://api.punkapi.com/v2/beers?hops="+item.name.replace(" ","_")));
      }
      for (let item of this.beer.ingredients.malt){
        requests.push(axios.get("https://api.punkapi.com/v2/beers?malt="+item.name.replace(" ","_")));
      }
      axios.all(requests)
      .then(function(results) {
        results.forEach(response => {
          for (let item of response.data){
              similar.push(item);
          }
        });
        for (var i=0; i<3; i++){
          let rand = Math.floor(Math.random()*(similar.length-1));
          self.threeSimilar.push(similar[rand]);
        }
      })
    }
  }
});

/*--- router ---*/

const routes = [
  {path : '/', component: Home},
  {path : '/random', component: Random},
  {path : '/categories', component: Categories},
  {path : '/detail/:id', name: 'details', component: Detail, props: true}
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

new Vue({
  el: "#app",
  router,
  data:{
    active: 'home'
  },
  methods: {
    activate: function(name: string){
      this.active = name;
    }
  }
})