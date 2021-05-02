import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';
import { RichText } from 'prismic-dom';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  // next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }) {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.container}>
        <div className={styles.posts}>
          
          {posts.map(post => {
            return (
              <Link href={`/post/${post.slug}`}>
                <a key={post.slug}>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
                    <p><FiCalendar /> <time>{post.updatedAt}</time></p>
                    <p><BsPerson /> {post.data.author}</p>
                  </div>
                </a>
              </Link>
            )
          })}          
        </div>

        <a className={styles.loadMoreButton}>
          Carregar mais...
        </a>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', {
      pageSize : 2,
      fetch: ['posts.title', 'posts.subtitle', 'posts.author']
    });
    
    const posts = postsResponse.results.map(post => {
      return {
        slug: post.uid,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        data: {
          author: post.data.author,
          title: post.data.title,
          subtitle: post.data.subtitle,
        }
      };
    });

  return {
    props:{
      posts
    }
  };
};
