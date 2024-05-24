import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const images = ['/banner-1.jpg', '/banner-2.jpg', '/banner-3.jpg'];

const PageContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Banner = styled.div<{ $backgroundImage: string }>`
  width: 100vw;
  height: 810px;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 0;
  transition: background-image 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const TextOverlay = styled.div`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: absolute;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const Button = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.29);
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0);
  }
`;

const Content = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
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

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        imageUrl: doc.data().imagaUrl,
        createdAt: doc.data().createdAt,
      })) as Post[];
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PageContainer>
      <Banner $backgroundImage={images[currentImageIndex]}>
        <TextOverlay>
          <h1>Welcome to the Community!</h1>
          <p>This is the home page of our community site.</p>
          <Button to='/about-us'>About Us</Button>
        </TextOverlay>
      </Banner>
      <Content>
        <PostGrid>
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
        </PostGrid>
      </Content>
    </PageContainer>
  );
}
