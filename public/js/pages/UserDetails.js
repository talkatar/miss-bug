import { userService } from "../services/user.service.js"
import BugList from '../cmps/BugList.js'
import { bugService } from '../services/bug.service.js'

export default {
    template: `
        <section class="user-details" v-if="user">
            <h5 v-if="isMyProfile">My Profile</h5>
            <pre v-if="isAdmin()">****</pre>  
            <BugList :bugs="bugs"></BugList>            
           


            <pre>{{loggedinUser}}</pre>    
        </section>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser(),
            user: null,
            bugs:[],
            filterBy: { userId: '' },

        }
    },
    created() {
        this.loadUser()
        const { userId } = this.$route.params
        this.loadBugs()
    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        }
    },
    watch: {
        userId() {
            this.loadUser()
        }
    },
    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        },

        loadBugs() {
            bugService.query()
            .then((bugs) => {
                    if (this.loggedinUser.fullname === 'admin') return this.bugs = bugs
                   else{ this.bugs = bugs.filter(bug => {
                        return bug.creator._id === this.loggedinUser._id
                    })}
                }
                )
        },
         isAdmin() {
            console.log('this.loggedinUser',this.loggedinUser)
            if (this.loggedinUser.fullname === 'admin') return true
        }
   
    },
    components:{
        BugList
    }
    
}