'use strict'
import { bugService } from '../services/bug.service.js'
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'
import { utilService } from '../services/util.service.js'

export default {
	template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
		<select class="sort-by" @change="loadBugs" v-model="sortBy.by">
                <option value="">Select Sorting</option>
                <option value="createdAt">CreatedAt</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
            </select>
		
			<label>
				Descending
				<input  class="sort-desc" type="checkbox" @input="onSetDesc" />
			</label>
		</div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
		<button @click="getPage(-1)">Prev</button>
        <button @click="getPage(1)">Next</button>
    </section>
    `,
data() {
	return {
		sortBy: {
			by: '',
			desc: 1
		},
		bugs: [],
		filterBy: { title: '', page: 0, severity: null, labels: null },
		toggle: false,
		totalPages: 0
	}
},
	created() {
		this.loadBugsLater = utilService.debounce(this.loadBugs, 500)
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy, this.sortBy).then(( bugs ) => {

				this.bugs = bugs
			})
		},
		getPage(dir) {
			this.filterBy.page += dir
			if (this.filterBy.page < 0) this.filterBy.page = 0
			this.loadBugs()
		},
		setFilterBy(filterBy) {
			this.filterBy = filterBy
			this.loadBugsLater()

		},
		removeBug(bugId) {
			console.log('sdfsdf');
			bugService.remove(bugId).then(() => this.loadBugs())
		},
		onSetDesc() {
			//HERE
			this.sortBy.desc *= -1
			this.loadBugs()
		}
	},
	computed: {
		// bugsToDisplay() {
		// 	if (!this.filterBy?.title) return this.bugs
		// 	return this.bugs.filter((bug) => bug.title.includes(this.filterBy.title))
		// },
	},
	components: {
		bugList,
		bugFilter,
	},
}
