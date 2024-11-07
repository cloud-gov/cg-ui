import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { fetchXML, getBlogFeed } from '@/api/blog/blog';
import fs from 'node:fs';
import path from 'node:path';

const blogFeedXml = fs.readFileSync(
  path.join(__dirname, '/../mocks/blogFeed.xml'),
  'utf8'
);

const blogUrl = new URL(process.env.NEXT_PUBLIC_BLOG_FEED_URL);

beforeEach(() => {
  if (!nock.isActive()) {
    nock.activate();
  }
});

afterEach(() => {
  nock.cleanAll();
  // https://github.com/nock/nock#memory-issues-with-jest
  nock.restore();
});

describe('fetchXML', () => {
  describe('on success', () => {
    it('returns xml as text', async () => {
      // setup
      nock(blogUrl.origin).get(blogUrl.pathname).reply(200, blogFeedXml);
      // act
      const result = await fetchXML(blogUrl);
      // assert
      expect(result).toEqual(blogFeedXml);
    });
  });
  describe('on request error', () => {
    it('throws error', async () => {
      // setup
      nock(blogUrl.origin).get(blogUrl.pathname).reply(500);
      // act
      expect(async () => {
        await fetchXML(blogUrl);
      }).rejects.toThrow();
    });
  });
});

describe('getBlogFeed', () => {
  describe('on success', () => {
    it('returns blog feed as parsed json', async () => {
      // setup
      nock(blogUrl.origin).get(blogUrl.pathname).reply(200, blogFeedXml);
      // act
      const blog = await getBlogFeed();
      // assert
      const post = blog.feed.entry[0];
      const title = post.title._text;
      const pubDate = post.published._text;
      const link = post.id._text;
      const summary = post.summary._cdata;
      expect(title).toEqual('August 8th Cloud.gov Release Notes');
      expect(pubDate).toEqual('2024-08-08T00:00:00+00:00');
      expect(link).toEqual('https://cloud.gov/2024/08/08/release-notes');
      expect(summary).toEqual(
        'The Cloud.gov team is working on providing release notes so everyone can see new features and updates.'
      );
    });
  });

  describe('on request error', () => {
    it('throws error', async () => {
      // setup
      nock(blogUrl.origin).get(blogUrl.pathname).reply(500);
      // act
      expect(async () => {
        await getBlogFeed();
      }).rejects.toThrow();
    });
  });
});
