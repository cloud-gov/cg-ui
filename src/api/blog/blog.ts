/***/
// API library for basic error handling and serialization
/***/

import { request } from '@/api/api';
import { logDevError } from '@/controllers/controller-helpers';
import convert from 'xml-js';

export interface BlogEntryObj {
  title: {
    _text: string;
  };
  published: {
    _text: string;
  };
  id: {
    _text: string;
  };
  summary: {
    _cdata: string;
  };
}

export interface BlogObj {
  feed: {
    entry: BlogEntryObj[];
  };
}

export async function fetchXML(url: string): Promise<string> {
  try {
    const response = await request(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    const msg = `Error fetching or parsing XML: ${error}`;
    logDevError(msg);
    throw new Error(msg);
  }
}

export async function getBlogFeed(): Promise<BlogObj> {
  try {
    if (!process.env.NEXT_PUBLIC_BLOG_FEED_URL) {
      throw new Error('blog feed url environment varisable is not set');
    }
    const xml = await fetchXML(process.env.NEXT_PUBLIC_BLOG_FEED_URL);
    const jsonString = convert.xml2json(xml, { compact: true });
    return JSON.parse(jsonString);
  } catch (error) {
    const msg = `Error fetching or parsing blog feed: ${error}`;
    logDevError(msg);
    throw new Error(msg);
  }
}
