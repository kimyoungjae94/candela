import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const Content = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const PostImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

interface Post {
  title: string;
  content: string;
  imageUrl: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function TravelDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost(postSnap.data() as Post);
        }
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Title>{post.title}</Title>
      {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
      <Content>{post.content}</Content>
      <small>
        {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
      </small>
    </Container>
  );
}
