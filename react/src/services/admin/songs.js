import { request, config } from "utils/admin";

const { api } = config;
const { songs, trashedSongs } = api;

export async function Songs() {
  return request({
    url: songs,
    method: "get",
  });
}

export async function TrashedSongs() {
  return request({
    url: trashedSongs,
    method: "get",
  });
}
