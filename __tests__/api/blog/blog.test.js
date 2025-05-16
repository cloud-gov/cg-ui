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
      const pubDate = post.updated._text;
      const link = post.link._attributes._text || post.id._text;
      const contentHTML = post.content._text;
      expect(title).toEqual(
        'Audit events now available in Cloud.gov logging system'
      );
      expect(pubDate).toEqual('2025-05-08T00:00:00Z');
      expect(link).toEqual(
        'https://cloud.gov/2025/05/08/audit-events-opensearch/'
      );
      expect(contentHTML).toEqual(
        '<p>This may have HTML <a href="https://cloud.gov/docs" target="_blank" class="usa-link--external" rel="noopener noreferrer">including inline links</a> and other formatting.</p>'
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
