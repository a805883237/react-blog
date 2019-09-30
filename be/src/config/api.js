

const api = {
  host : process.env.NODE_ENV === 'development' ?
    'http://api.andd.top' :
    'http://api.andd.top', // api的base_url
};



export default api;