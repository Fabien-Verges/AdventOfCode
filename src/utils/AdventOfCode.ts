import { Axios, AxiosError, HttpStatusCode } from 'axios';
import { env } from 'process';

import { getConfig } from './ConfigFile.js';
import { throwError } from './Utils.js';

const axios = new Axios({
    baseURL: `${getConfig().AOC_HOSTNAME}`,
    headers: {
        cookie: `session=${
            getConfig().AOC_SESSION_TOKEN ||
            env.AOC_SESSION_TOKEN ||
            throwError('No AOC_SESSION_TOKEN specified.', 'You sould use the `aoc setup` command to fix it')
        }`,
    },
});

enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
}

export async function getInput(year: number, day: number) {
    const response = await callAOC(METHODS.GET, `/${year.toString()}/day/${day.toString()}/input`);
    if (response.status === HttpStatusCode.Ok) {
        return response.data as string;
    }

    throwError(
        `An error has occured while retrieving the puzzle input on ${getConfig().AOC_HOSTNAME}. HTTP code: ${
            response.status
        }`
    );
}

export async function getName(year: number, day: number) {
    const puzzleContent = await callAOC(METHODS.GET, `/${year.toString()}/day/${day.toString()}`);
    if (puzzleContent.status === HttpStatusCode.Ok) {
        const match = puzzleContent.data.match(/<h\d>--- Day \d+:\s+(.*)\s---/);
        return match.length === 2 ? (match[1] as string) : throwError('Failed to find the puzzle name in the AOC page');
    }

    throwError(
        `An error has occured while retrieving the puzzle name on ${getConfig().AOC_HOSTNAME}. HTTP code: ${
            puzzleContent.status
        }`
    );
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
        if (e instanceof AxiosError) {
            throwError(
                `An error occurs during the Advent Of Code HTTP request:
                  request: ${e.request}
                  statuscode: ${e.code}
                  message: ${e.message}
                `
            );
        }

        throwError('An error occurs during the Advent Of Code HTTP request');
    }
}
