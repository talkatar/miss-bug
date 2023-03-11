'use strict'

import {userService} from '../services/user.service.js'

export default {
	template: `
    <section >                    
      <li v-if="users" v-for="user in users"  :key="user._id"  >{{ user.fullname }}  <button  @click="removeUser(user._id)">X</button>
 </li>
    </section>
    `,
    data(){
        return{
            users:[]
        }
    }
    ,
	methods: {

        loadUsers() {
            console.log('removed');
			userService.query().then(( users ) => {
				this.users = users
			})
		},
        removeUser(userId) {
			
			userService.remove(userId).then(() => this.loadUsers())
		},

        
    },
	components: {
		
	},

    created() {
      userService.query()
        .then((users) => {
            console.log(users);
            this.users=users
     
    })
},



}

