import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

const PageContainer = styled.div`
  display: flex;
  justify-content: center; /* 전체 페이지 중앙 정렬 */
  // padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px; /* 최대 너비를 늘림 */
  padding-top: 0; /* 네비게이션 바 아래에 붙도록 설정 */
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center; /* 텍스트 중앙 정렬 */
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(300px, 1fr)
  ); /* 유동적 그리드 설정 */
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const PostItem = styled.div`
  width: 100%;
  max-width: 300px; /* 최대 너비 설정 */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
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

export default function Travel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user] = useAuthState(auth);
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
  }, [location.state, navigate, location.pathname]);

  const handlePostClick = (postId: string) => {
    navigate(`/travel-detail/${postId}`);
  };

  const handleCreatePostClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/travel-create-post');
    }
  };

  return (
    <PageContainer>
      <Container>
        <Title>Travel Posts</Title>
        <ButtonContainer>
          <Button onClick={handleCreatePostClick}>Create Post</Button>
        </ButtonContainer>
        <PostGrid>
          {posts.map((post) => (
            <PostItem key={post.id} onClick={() => handlePostClick(post.id)}>
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
        </PostGrid>
      </Container>
    </PageContainer>
  );
}
