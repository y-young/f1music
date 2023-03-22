import { request } from "utils";
import { api } from "config";

const { search, mp3, upload, uploads, status } = api;

export async function Search(keyword) {
  return request({
    url: search,
    method: "post",
    data: { keyword: keyword }
  });
}

export async function Mp3(id) {
  return request({
    url: mp3,
    method: "post",
    data: { id: id }
  });
}

export async function Upload(params) {
  return request({
    url: upload,
    method: "post",
    data: params
  });
}

export async function View() {
  return request({
    url: uploads,
    method: "get"
  });
}

export async function Status() {
  return request({
    url: status + "/upload",
    method: "get"
  });
}
