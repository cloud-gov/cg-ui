import Link from 'next/link';
import { getBlogFeed, BlogObj } from '@/api/blog/blog';
import { formatDate } from '@/helpers/dates';
import Image from '@/components/Image';

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
        <h2 className="margin-top-0 text-normal">
          Here’s the latest from <strong>the Cloud.gov&nbsp;blog</strong>:
        </h2>
        <div className="display-flex">
          <Image
            src="/img/blog_img.png"
            width={120}
            height={80}
            alt=""
            className="margin-right-2"
          />
          <h3 className="margin-top-0">
            <Link href={link} target="_blank" className="usa-link">
              {title}
            </Link>
          </h3>
        </div>
        <p className="line-height-sans-4">
          {pubDate} — {summary}{' '}
          <Link href={link} target="_blank" className="usa-link">
            Read more »
          </Link>
        </p>
      </div>
    );
  } catch (error: any) {
    return <div>Blog not available</div>;
  }
}
