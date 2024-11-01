import { getBlogFeed, BlogObj } from '@/api/blog/blog';
import { formatDate } from '@/helpers/dates';
import Link from 'next/link';
import Image from 'next/image';

export async function BlogSnippet() {
  try {
    const blog = (await getBlogFeed()) as BlogObj;
    const post = blog.feed.entry[0];
    const title = post.title._text;
    const pubDate = formatDate(post.published._text).toUpperCase();
    const link = post.id._text;
    const summary = post.summary._cdata;

    return (
      <div>
        <h2 className="margin-top-0 text-light">
          Here’s the latest from <strong>the Cloud.gov blog</strong>:
        </h2>
        <div className="display-flex">
          <Image
            src="/img/blog_img.png"
            width={120}
            height={80}
            alt=""
            className="margin-right-2"
          />
          <h3 className="margin-top-1">
            <Link href={link} target="_blank">
              {title}
            </Link>
          </h3>
        </div>
        <p>
          {pubDate} — {summary}{' '}
          <Link href={link} target="_blank">
            Read more »
          </Link>
        </p>
      </div>
    );
  } catch (error: any) {
    return <div>Blog not available</div>;
  }
}
