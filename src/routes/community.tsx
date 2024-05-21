import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PostItem = styled.li`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 300px; /* 이미지 최대 높이 설정 */
  object-fit: cover; /* 이미지가 비율에 맞게 잘리도록 설정 */
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
        createdAt: doc.data().createdAt,
      })) as Post[];
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (location.state && (location.state as { newPost: Post }).newPost) {
      const newPost = (location.state as { newPost: Post }).newPost;
      setPosts((prevPosts) => {
        if (!prevPosts.some((post) => post.id === newPost.id)) {
          return [newPost, ...prevPosts];
        }
        return prevPosts;
      });
      navigate(location.pathname, { replace: true }); // Clear state
    }
  }, [location.state, navigate]);

  return (
    <Container>
      <Title>Community Posts</Title>
      <ButtonContainer>
        <Link to='/create-post'>
          <Button>Create Post</Button>
        </Link>
      </ButtonContainer>
      <PostList>
        {posts.map((post) => (
          <PostItem key={post.id}>
            {post.imageUrl && (
              <PostImage src={post.imageUrl} alt={post.title} />
            )}
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>
              {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
            </small>
          </PostItem>
        ))}
      </PostList>
    </Container>
  );
}
