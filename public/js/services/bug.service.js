

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filterBy = {}, sortBy) {
  return axios.get(`/api/bug`, { params: { ...filterBy, ...sortBy } })
    .then(res => {console.log('front1',res.data);
      return res.data
    })

}

function getById(bugId) {
  return axios.get(`/api/bug/${bugId}`)
    .then(res => res.data)
    .catch(err=>{
      throw new Error('Wait a bit')
    })
  
}


function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`)
    .then(res => res.data)
}




// function save(bug) {
//   const queryParams = `title=${bug.title}&description=${bug.description}&
//   &severity=${bug.severity}&_id=${bug._id || ''}`
//   return axios.get(`/api/bug/save?${queryParams}`)
//     .then(res => res.data)
// }


function save(bug) {
  if(bug._id) {
      return axios.put(`/api/bug/${bug._id}`, bug)
          .then(res => res.data)
  } else {
    console.log('save');
      return axios.post(`/api/bug`, bug)
          .then(res => res.data)
  }
}