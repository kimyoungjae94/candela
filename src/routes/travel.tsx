import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactPaginate from 'react-paginate';
import '../styles/pagination.css';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const PostItem = styled.div`
  width: 100%;
  max-width: 300px;
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
  background-color: #000000b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #424242;
  }
`;

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
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
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 8;

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          author: data.author,
          createdAt: data.createdAt || { seconds: 0, nanoseconds: 0 },
        };
      }) as Post[];
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
      navigate(location.pathname, { replace: true });
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

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const currentPosts = posts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  return (
    <PageContainer>
      <Container>
        <Title>Travel Posts</Title>
        <ButtonContainer>
          <Button onClick={handleCreatePostClick}>게시물 생성</Button>
        </ButtonContainer>
        <PostGrid>
          {currentPosts.map((post) => (
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
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(posts.length / postsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </Container>
    </PageContainer>
  );
}
