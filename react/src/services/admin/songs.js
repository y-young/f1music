import { request } from "utils/admin";
import { api } from "utils/admin/config";

const { songs, trashedSongs, trashSongs, restoreSongs } = api;

export async function Songs() {
  return request({
    url: songs,
    method: "get"
  });
}

export async function TrashedSongs() {
  return request({
    url: trashedSongs,
    method: "get"
  });
}

export async function Save(params) {
  return request({
    url: songs,
    method: "put",
    data: params
  });
}

export async function Trash(id) {
  return request({
    url: trashSongs,
    method: "post",
    data: { id: id }
  });
}

export async function Restore(id) {
  return request({
    url: restoreSongs,
    method: "post",
    data: { id: id }
  });
}

export async function Delete(id) {
  return request({
    url: songs,
    method: "delete",
    data: { id: id }
  });
}
