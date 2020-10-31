<template>
  <div id="app">
    <b-container class="bv-example-row">
      <b-row>
          <b-col><b-table hover :items="items"></b-table></b-col>
          <b-col>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">

              <b-form-group id="exampleInputGroup1"
                            label="First Name"
                            label-for="exampleInput1">
                <b-form-input id="exampleInput1"
                              type="text"
                              v-model="form.fname"
                              required
                              placeholder="Enter First Name">
                </b-form-input>
              </b-form-group>

              <b-form-group id="exampleInputGroup2"
                            label="Your Last Name"
                            label-for="exampleInput2">
                <b-form-input id="exampleInput2"
                              type="text"
                              v-model="form.lname"
                              required
                              placeholder="Enter Last Name">
                </b-form-input>
              </b-form-group>
              <b-form-group id="exampleInputGroup3"
                            label="Your Age"
                            label-for="exampleInput3">

                <b-form-input id="exampleInput3"
                              type="number"
                              v-model="form.age"
                              required
                              placeholder="Enter Age">
                </b-form-input>

              </b-form-group>


              <b-form-group id="exampleInputGroup4"
                            label="Active:"
                            label-for="exampleInput4">
                <b-form-select id="exampleInput4"
                              :options="foods"
                              required
                              v-model="form.isActive">
                </b-form-select>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </b-col>
      </b-row>
  </b-container>
  </div>
</template>

<script>
import VuePouchDB from 'vue-pouch-db'

const bucket = new VuePouchDB.Bucket({
  // Main config Object. This is the top level
  // config object. Where global config
  // are shared with each database.
  config: {
    // Remote Server
    remote: "COUCHDB SERVER",

    // Is DB Remote Only?, default: false
    remoteOnly: false,

    // db.allDocs({options})
    allDocs: {
      include_docs: true
    },

    // new Pouch({options})
    options: {
      ajax: {
        cache: true
      }
    },

    // Pouch.sync({option}) for every Instance
    sync: {
      since: 0,
      live:  true,
      retry: true
    },

    // db.changes({option})
    changes: {
      since: 'now',
      live: true,
      include_docs: true
    },

    // Global onChange events
    // for each database.
    // The functions here are passed to each DB
    // db.changes().on(() => {})
    onChanges(change) {
      console.log("Change: ", change);
    },
    onPaused(error) {
      console.log("Paused", error);
    },
    onActive() {
      console.log("Active");
    },
    onDenied(error) {
      console.log("Denied", error);
    },
    onComplete() {
      console.log("Completed");
    },
    onError(error) {
      console.log("Error", error);
    },
    cancel(cancel) {
      // 'cancel' var is a function to be called
      // when something bad happens. It will
      // Cancel the watch event on CouchDB
    }
  },

  // List of PouchDB plugins
  // plugins: [
  //   require('pouchdb-plugin')
  // ],

  // Actions are shared across the
  // bucket instance.
  // Think of them as helper methods to bundle
  // several sets of commands into a single method.
  // Can be accessed through this.$bucket.[method name]
  // actions: {
  //   addDoc(arg) {
  //     // this is $bucket instance
  //     this.db('projects').({
  //       _id: 'document_id'
  //       data: {}
  //     }, function () {});
  //   }
  // }

  // Databases
  // You can define / instanciate
  // a per database config file.
  // this will put the database into the internal
  // state and also, you can define custom "options"
  // for the database Instance (on: new PouchDB(options))
  _users: {
    // Is remote only ?
    // The _users database lives only
    // in the server, so its only remote
    remoteOnly: true
  },

  // 'projects' key -> Database Name, ex: couchdb.com/projects
  projects: {
    // PouchDB.sync Options
    sync: {
      push: {
        // config for push
      },
      pull: {
        filter: 'projects/by_user',
        query_params: { "name": "sadi" }
      }
    }

  }
})


export default {
  name: 'app',
  bucket,
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      items: [
        // { first_name: 'Dickerson', last_name: 'Macdonald', age: 40, isActive: true },
        // { first_name: 'Larsen', last_name: 'Shaw', age: 21, isActive: true },
        // { first_name: 'Geneva', last_name: 'Wilson', age: 89, isActive: true },
        // { first_name: 'Jami', last_name: 'Carney', age: 38, isActive: true }
      ],
      show: true,
      form: {
        _id: '',
        fname: '',
        lname: '',
        age: null,
        isActive: ''
      },
      foods: [
        { text: 'Select One', value: null },
        { text: 'Active', value: true },
        { text: 'Not Active', value: false },
      ]
    }
  }, // end of data
  methods: {
    view () {
      let vm = this
      this.$bucket.allDocs({
        include_docs: true
      }).then((response) => {
        for (var i = 0; i < response.rows.length; i++) {
          vm.items.push(response.rows[i].doc)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
   onSubmit (evt) {
      evt.preventDefault()
      // alert(JSON.stringify(this.form))
      console.log('bucket', this.$bucket)
      this.view()
      this.items.push(this.form)
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.fname = ''
      this.form.lname = ''
      this.form.age = ''
      this.form.isActive = ''
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

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
