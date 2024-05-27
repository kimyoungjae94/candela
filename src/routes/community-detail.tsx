import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import Comments from './community-comments';

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  margin-right: 10px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  views: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function CommunityDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postRef = doc(db, 'qandas', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data() as Post;
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          await updateDoc(postRef, {
            views: (postData.views || 0) + 1,
          });
        }
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTitle(post?.title || '');
    setContent(post?.content || '');
  };

  const handleSave = async () => {
    if (postId) {
      const postRef = doc(db, 'qandas', postId);
      await updateDoc(postRef, {
        title,
        content,
      });
      setEditMode(false);
      setPost((prev) => (prev ? { ...prev, title, content } : null));
    }
  };

  const handleDelete = async () => {
    if (postId) {
      await deleteDoc(doc(db, 'qandas', postId));
      navigate('/community-list');
    }
  };

  if (!post) {
    return <Container>Loading...</Container>;
  }

  const isAuthor = user && user.displayName === post.author;

  return (
    <Container>
      {editMode ? (
        <>
          <TextArea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
          />
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
          <ButtonContainer>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </ButtonContainer>
        </>
      ) : (
        <>
          <Title>{post.title}</Title>
          <small>작성자: {post.author}</small>
          <br />
          <small>
            작성일:{' '}
            {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
          </small>
          <br />
          <small>조회수: {post.views}</small>
          <Divider />
          <Content>{post.content}</Content>
          {isAuthor && (
            <ButtonContainer>
              <Button onClick={handleEdit}>Edit</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </ButtonContainer>
          )}
          <Divider />
          <Comments postId={postId!} />
        </>
      )}
    </Container>
  );
}
