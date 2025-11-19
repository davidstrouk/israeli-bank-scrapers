import nodeFetch from 'node-fetch';
import { type Page } from 'puppeteer';
import { getDebug } from './debug';

const JSON_CONTENT_TYPE = 'application/json';
const debug = getDebug('fetch');

function getJsonHeaders() {
  return {
    Accept: JSON_CONTENT_TYPE,
    'Content-Type': JSON_CONTENT_TYPE,
  };
}

export async function fetchGet<TResult>(url: string, extraHeaders: Record<string, any>): Promise<TResult> {
  debug(`fetchGet: ${url}`);
  let headers = getJsonHeaders();
  if (extraHeaders) {
    headers = Object.assign(headers, extraHeaders);
  }
  const request = {
    method: 'GET',
    headers,
  };
  const fetchResult = await nodeFetch(url, request);
  debug(`fetchGet response status: ${fetchResult.status}`);

  if (fetchResult.status !== 200) {
    const errorMsg = `sending a request to the institute server returned with status code ${fetchResult.status}`;
    debug(`fetchGet error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const result = await fetchResult.json();
  debug('fetchGet success: received JSON response');
  return result;
}

export async function fetchPost(url: string, data: Record<string, any>, extraHeaders: Record<string, any> = {}) {
  debug(`fetchPost: ${url}`);
  const request = {
    method: 'POST',
    headers: { ...getJsonHeaders(), ...extraHeaders },
    body: JSON.stringify(data),
  };
  const result = await nodeFetch(url, request);
  debug(`fetchPost response status: ${result.status}`);
  const jsonResult = await result.json();
  debug('fetchPost success: received JSON response');
  return jsonResult;
}

export async function fetchGraphql<TResult>(
  url: string,
  query: string,
  variables: Record<string, unknown> = {},
  extraHeaders: Record<string, any> = {},
): Promise<TResult> {
  debug(`fetchGraphql: ${url}`);
  const result = await fetchPost(url, { operationName: null, query, variables }, extraHeaders);
  if (result.errors?.length) {
    debug(`fetchGraphql error: ${result.errors[0].message}`);
    throw new Error(result.errors[0].message);
  }
  debug('fetchGraphql success');
  return result.data as Promise<TResult>;
}

export function fetchGetWithinPage<TResult>(page: Page, url: string): Promise<TResult | null> {
  debug(`fetchGetWithinPage: ${url}`);
  return page.evaluate(innerUrl => {
    return new Promise<TResult | null>((resolve, reject) => {
      console.log(`[fetch] GET ${innerUrl}`);
      fetch(innerUrl, {
        credentials: 'include',
      })
        .then(async result => {
          console.log(`[fetch] GET ${innerUrl} - status: ${result.status}`);
          if (result.status === 204) {
            console.log(`[fetch] GET ${innerUrl} - 204 No Content`);
            resolve(null);
          } else if (!result.ok) {
            const text = await result.text();
            console.error(`[fetch] GET ${innerUrl} - Error: ${text.substring(0, 200)}`);
            reject(new Error(`HTTP ${result.status}: ${text.substring(0, 200)}`));
          } else {
            const text = await result.text();
            if (!text || text.trim() === '') {
              console.log(`[fetch] GET ${innerUrl} - Empty response`);
              resolve(null);
            } else {
              try {
                const parsed = JSON.parse(text);
                console.log(`[fetch] GET ${innerUrl} - Success`);
                resolve(parsed);
              } catch (e) {
                console.error(`[fetch] GET ${innerUrl} - Invalid JSON: ${text.substring(0, 200)}`);
                reject(new Error(`Invalid JSON response: ${text.substring(0, 200)}`));
              }
            }
          }
        })
        .catch(e => {
          console.error(`[fetch] GET ${innerUrl} - Exception:`, e);
          reject(e);
        });
    });
  }, url);
}

export function fetchPostWithinPage<TResult>(
  page: Page,
  url: string,
  data: Record<string, any>,
  extraHeaders: Record<string, any> = {},
): Promise<TResult | null> {
  debug(`fetchPostWithinPage: ${url}`);
  return page.evaluate(
    (innerUrl: string, innerData: Record<string, any>, innerExtraHeaders: Record<string, any>) => {
      return new Promise<TResult | null>((resolve, reject) => {
        console.log(`[fetch] POST ${innerUrl}`);
        fetch(innerUrl, {
          method: 'POST',
          body: JSON.stringify(innerData),
          credentials: 'include',
          // eslint-disable-next-line prefer-object-spread
          headers: Object.assign(
            { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            innerExtraHeaders,
          ),
        })
          .then(async result => {
            console.log(`[fetch] POST ${innerUrl} - status: ${result.status}`);
            if (result.status === 204) {
              // No content response
              console.log(`[fetch] POST ${innerUrl} - 204 No Content`);
              resolve(null);
            } else if (!result.ok) {
              const text = await result.text();
              console.error(`[fetch] POST ${innerUrl} - Error: ${text.substring(0, 200)}`);
              reject(new Error(`HTTP ${result.status}: ${text.substring(0, 200)}`));
            } else {
              const text = await result.text();
              if (!text || text.trim() === '') {
                console.log(`[fetch] POST ${innerUrl} - Empty response`);
                resolve(null);
              } else {
                try {
                  const parsed = JSON.parse(text);
                  console.log(`[fetch] POST ${innerUrl} - Success`);
                  resolve(parsed);
                } catch (e) {
                  console.error(`[fetch] POST ${innerUrl} - Invalid JSON: ${text.substring(0, 200)}`);
                  reject(new Error(`Invalid JSON response: ${text.substring(0, 200)}`));
                }
              }
            }
          })
          .catch(e => {
            console.error(`[fetch] POST ${innerUrl} - Exception:`, e);
            reject(e);
          });
      });
    },
    url,
    data,
    extraHeaders,
  );
}
