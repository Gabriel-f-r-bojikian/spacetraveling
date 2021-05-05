import next, { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import LoadMoreButton from '../components/LoadMoreButton';

import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { RichText } from 'prismic-dom';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar } from 'react-icons/fi'
import { BsPerson } from 'react-icons/bs'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';

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
  
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage() {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postResults = await fetch(`${nextPage}`).then(response => response.json());

    console.log(postResults);

    setNextPage(postResults.next_page);
    setCurrentPage(postResults.page);

    const newFormattedPosts = postResults.results.map( post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          author: post.data.author,
          title: post.data.title,
          subtitle: post.data.subtitle,
        }
      };
    });

    setPosts([...posts, ...newFormattedPosts ])

  }
  
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.container}>
        <div className={styles.posts}>
          
          {posts.map(post => {
            return (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a key={post.uid}>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
                    <FiCalendar /> 
                    <time>
                      {
                        format(
                          new Date(post.first_publication_date),
                          "d MMM yyyy",
                          { locale: ptBR }
                        )
                      }
                      </time>
                    <BsPerson /> 
                    <span>{post.data.author}</span>
                  </div>
                </a>
              </Link>
            )
          })}          
        </div>
        
        {nextPage && (
          <LoadMoreButton onClick={handleNextPage} next_page={postsPagination.next_page} />
        )}
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query( Prismic.predicates.at('document.type', 'posts'), {
      pageSize : 5,
      fetch: ['posts.title', 'posts.subtitle', 'posts.author']
    });
    
    const formattedPosts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
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
