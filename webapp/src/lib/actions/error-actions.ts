'use server';

import { fetchClient } from "../fetch-client";

export async function triggerError(code: number){
    return fetchClient(`/test/errors?code=${code}`, 'GET');
}