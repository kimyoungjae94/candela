import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px; /* 이미지와 내용 사이의 간격 */
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const PostImage = styled.img`
  max-width: 100%;
  max-height: 600px;
  width: auto;
  height: auto;
  border-radius: 4px;
`;

const AuthorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 16px;
  color: #555;
`;

const Divider = styled.hr`
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
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

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

interface Post {
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  authorId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function TravelDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data() as Post;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
        }
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = async () => {
    if (postId && post) {
      const confirmed = window.confirm('수정하시겠습니까?');
      if (confirmed) {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          title,
          content,
        });
        setPost({ ...post, title, content });
        setIsEditing(false);
      }
    }
  };

  const handleDelete = async () => {
    if (postId) {
      const confirmed = window.confirm('삭제하시겠습니까?');
      if (confirmed) {
        await deleteDoc(doc(db, 'posts', postId));
        navigate('/travel');
      }
    }
  };

  if (!post) {
    return <Container>Loading...</Container>;
  }

  const isAuthor = user?.uid === post.authorId;

  return (
    <Container>
      <ImageContainer>
        {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
      </ImageContainer>
      <ContentContainer>
        {isEditing ? (
          <>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextArea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <ButtonContainer>
              <Button onClick={handleEdit}>Save</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </ButtonContainer>
          </>
        ) : (
          <>
            <Title>{post.title}</Title>
            <AuthorContainer>
              <span>작성자 : {post.author}</span>
              <small>
                {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
              </small>
            </AuthorContainer>
            <Divider />
            <Content>{post.content}</Content>
            <Divider />
            {isAuthor && (
              <ButtonContainer>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button onClick={handleDelete}>Delete</Button>
              </ButtonContainer>
            )}
          </>
        )}
      </ContentContainer>
    </Container>
  );
}
