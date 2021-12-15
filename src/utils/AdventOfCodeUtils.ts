import { Axios } from "axios";

import { config } from "../config";

const axios = new Axios({
  baseURL: config.AOC_HOSTNAME,
  headers: { cookie: `session=${config.AOC_SESSION}` },
});

enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}

export async function getInput(year: number, day: number) {
  await callAOC(METHODS.GET, `/${year}/day/${day}/input`);
}

async function callAOC(method: METHODS, path: string, body?: any) {
  try {
    switch (method) {
      case METHODS.GET:
        return axios.get(path);
      case METHODS.POST:
        return axios.post(path, body);
      case METHODS.PUT:
        return axios.put(path, body);
    }
  } catch (e) {
    throw new Error("An error occurs during the Advent Of Code HTTP request");
  }
}
