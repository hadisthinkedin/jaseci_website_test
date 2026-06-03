import config from "@config/config.json";
import dateFormat from "@lib/utils/dateFormat";
import { humanize, slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

const Posts = ({ posts, className, authors }) => {
  const { summary_length } = config.settings;
  return (
    <div className={`row space-y-16 ${className}`}>
      {posts.map((post, i) => (
        <div
          key={`key-${i}`}
          className={i === 0 ? "col-12" : "col-12 sm:col-6"}
        >
          {post.frontmatter.image && (
            <div
              className={`relative w-full overflow-hidden rounded-lg ${
                // Bigger hero image for the first post, smaller but still responsive for the rest
                i === 0
                  ? "h-52 sm:h-64 md:h-72 lg:h-96 xl:h-[475px]"
                  : "h-44 sm:h-48 md:h-56 lg:h-60 xl:h-[230px]"
              }`}
            >
              <Image
                className="object-cover"
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                priority={i === 0}
                sizes={
                  i === 0
                    ? "(min-width: 1280px) 925px, (min-width: 1024px) 75vw, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 768px) 50vw, 100vw"
                }
              />
            </div>
          )}
          <ul className="mb-4 mt-4 flex flex-wrap items-center space-x-3 text-text">
            <li>
              {authors
                .filter((author) =>
                  post.frontmatter.authors
                    .map((author) => slugify(author))
                    .includes(slugify(author.frontmatter.title)),
                )
                .map((author, i) => (
                  <Link
                    href={`/authors/${slugify(author.frontmatter.title)}`}
                    key={`author-${i}`}
                    className="flex items-center hover:text-primary"
                  >
                    {author.frontmatter.image && (
                      <Image
                        src={author.frontmatter.image}
                        alt={author.frontmatter.title}
                        height={50}
                        width={50}
                        className="mr-2 h-6 w-6 rounded-full"
                      />
                    )}
                    <span>{author.frontmatter.title}</span>
                  </Link>
                ))}
            </li>
            <li>{dateFormat(post.frontmatter.date)}</li>
            <li>
              <ul>
                {post.frontmatter.categories.map((category, i) => (
                  <li className="inline-block" key={`category-${i}`}>
                    <Link
                      href={`/categories/${slugify(category)}`}
                      className="mr-3 hover:text-primary"
                    >
                      &#9635; {humanize(category)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <h3 className="mb-2">
            <Link href={`/${post.slug}`} className="block hover:text-primary">
              {post.frontmatter.title}
            </Link>
          </h3>
          <p className="text-text">
            {post.content && post.content.slice(0, Number(summary_length))}...
          </p>
        </div>
      ))}
    </div>
  );
};

export default Posts;
