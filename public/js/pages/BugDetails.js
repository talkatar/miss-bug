'use strict'

import { bugService } from '../services/bug.service.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <p>{{bug.description}}</p>  
      
        <router-link to="/bug">Back</router-link>

    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId)
        .then((bug) => {
          this.bug = bug})
        .catch(err=> eventBus.emit('show-msg', { txt: err, type: 'error' }) )
    }
  },
}
