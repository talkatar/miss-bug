const fs = require('fs')

const gBugs = require('../data/bug.json')

module.exports = {
    query,
    save,
    getById,
    remove
}

const PAGE_SIZE = 10

function query(filterBy = { }, sortBy) {
    // function query(filterBy = { title: '', page: 0, createdAt: null, severity: null }, sortBy) {

    //HERE
    sortBy.by === 'title'
        ? gBugs.sort((bug1, bug2) => (bug1[sortBy.by].localeCompare(bug2[sortBy.by])) * sortBy.desc)
        : gBugs.sort((bug1, bug2) => (bug1[sortBy.by] - bug2[sortBy.by]) * sortBy.desc)
    console.log(filterBy);

    const regex = new RegExp(filterBy.title, 'i')
    var bugs = gBugs.filter(bug => regex.test(bug.title))

    if (filterBy.labels) {
        console.log(filterBy.labels);
        bugs = bugs.filter(bug => {
            return filterBy.labels.some(label => bug.labels.includes(label))
        })
    }

    if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
    }


    
    return Promise.resolve(bugs)
}





function save(bug,loggedinUser) {
    var savedbug
    if (bug._id) {
        savedbug = gBugs.find(currBug => currBug._id === bug._id)
        if (!savedbug) return Promise.reject('Unknonwn bug')
        if (savedbug.creator._id !== loggedinUser._id) return Promise.reject('Not your car')
        console.log(loggedinUser);

        savedbug.title = bug.title
        savedbug.description = bug.description
        savedbug.severity = bug.severity
        savedbug.description = bug.description
    } else {
        savedbug = {
            _id: _makeId(),
            title: bug.title,
            description: bug.description,
            severity: bug.severity,
            description: bug.description,
            createdAt : Date.now(),
            labels: [
                'critical',
                'need-CR',
                'dev-branch'
              ],
            creator: {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname
              }
        }
        gBugs.push(savedbug)
    }
    return _saveBugsToFile().then(()=>{
        return savedbug
    })
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}


function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unknonwn bug')
    return Promise.resolve(bug)
}


function remove(bugId,loggedinUser) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknonwn bug')
    // if (gBugs[idx].creator._id !== loggedinUser._id) return Promise.reject('Not your bug')

    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}