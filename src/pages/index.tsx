import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { RichText } from 'prismic-dom';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'
import LoadMoreButton from '../components/LoadMoreButton';

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
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.container}>
        <div className={styles.posts}>
          
          {postsPagination.results.map(post => {
            return (
              <Link href={`/post/${post.uid}`}>
                <a key={post.uid}>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
                    <p><FiCalendar /> <time>{post.first_publication_date}</time></p>
                    <p><BsPerson /> {post.data.author}</p>
                  </div>
                </a>
              </Link>
            )
          })}          
        </div>
        
        <LoadMoreButton next_page={postsPagination.next_page} />
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query( Prismic.predicates.at('document.type', 'posts'), {
      pageSize : 4,
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      orderings: '[my.post.date desc]'
    });

    // console.log(JSON.stringify(postsResponse, null, 2))
    
    const formattedPosts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        data: {
          author: post.data.author,
          title: post.data.title,
          subtitle: post.data.subtitle,
        }
      };
    });

    const postsPagination = {
      next_page: postsResponse.next_page,
      results: formattedPosts,
    }

  return {
    props:{
      postsPagination
    }
  };
};
