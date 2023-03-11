'use strict'
import { userService } from "../services/user.service.js"

export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <p><span>created at:</span>{{bug.createdAt}}</p>     
                <!-- <p><span>labels:</span>{{bug.labels}}</p>         -->
   
                <li v-for="label in bug.labels" :key="bug.id"><span></span>{{ label }}</li>

                <RouterLink :to="'/user/' + bug.creator?._id">
                    Creator: {{ bug.creator?.fullname }}
                </RouterLink>


                
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link v-if="isCreator(bug)" :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button v-if="isCreator(bug)" @click="onRemove(bug._id)">X</button>
              </article>`,
  methods: {
    onRemove(bugId) {
      console.log('removeBug')
      this.$emit('removeBug', bugId)
    },
    isCreator(bug){
      const user = userService.getLoggedInUser()
      if (!user) return false
      if(user.fullname === 'admin') {
        console.log(user.fullname);

        return true}
      if (user._id !== bug.creator._id) return false
      return true

      }


  
  },
}
