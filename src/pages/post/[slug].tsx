import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';
import { FiCalendar } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { AiOutlineClockCircle } from 'react-icons/ai';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  function countTimeToReadPost() {
    let numberOfWords = 0;
    const wordsReadPerMinute = 200;
    
    numberOfWords = post.data.content.reduce(countWordsInPieceOfContent, 0);

    return Math.ceil(numberOfWords/wordsReadPerMinute);
  }

  function countWordsInPieceOfContent(wordsCountedSoFar: number, pieceOfContent) {
    const wordsInHeading = countWords(pieceOfContent.heading);
    const wordsInBody = countWordsInBody(pieceOfContent.body);
    return wordsCountedSoFar + wordsInHeading + wordsInBody;
  }

  function countWords(str: string) {
    str = str.toString();
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
  }

  function countWordsInBody(body: string[]) {
    return body.reduce(countWordsInParagraph, 0);
  }

  function countWordsInParagraph(totalWordsInContentBody: number, paragraph) {
    return totalWordsInContentBody + countWords(paragraph.text);
  }
  
  return(
    <>
      <Header />
      <div className={styles.postContainer}>
        <main>
          <article>
            <img src={post.data.banner.url} alt="Banner do post" />
            <h1>{post.data.title}</h1>
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

            <AiOutlineClockCircle />
            <span>{countTimeToReadPost()} min</span>
            
            {post.data.content.map( postSection => {
              return (
                <>
                  <h2>{postSection.heading}</h2>
                  {postSection.body.map(paragraph => {
                    return (
                      <p>{paragraph.text}</p>
                    )
                  })}
                </>
              )
            })}
          </article>
        </main>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query( Prismic.predicates.at('document.type', 'posts'));

  const paths = postsResponse.results.map(post => ({
    params: {slug: post.uid.toString()}
  }));

  return { paths, fallback: false };
};

export async function getStaticProps({ params }) {
  
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', params.slug, {});

  const content = response.data.content;

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: content,
    },
  }

  return {
    props: {
      post
    }
  }
};
