import { request, config } from 'utils'

const { api } = config
const { login } = api

function Login(data) {
  return request({
    url: login,
    method: 'post',
    /*headers: {
      'Content-type': 'application/json'
    },*/
    data: data,
  })
}

function getCookie() {
  var match = document.cookie.match(new RegExp('(^| )' + 'MusicAuth' + '=([^;]+)'));
  if (match) return match[2];
  else return null;
}

function checkLogin() {
  return getCookie() !== null;
}

export { Login, checkLogin }

