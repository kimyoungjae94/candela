import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

const PostImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

const RemoveImageButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  views: number;
  imageUrl?: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        }
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTitle(post?.title || '');
    setContent(post?.content || '');
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (postId) {
      const postRef = doc(db, 'qandas', postId);

      let newImageUrl = post?.imageUrl || '';
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        newImageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(postRef, {
        title,
        content,
        imageUrl: newImageUrl,
      });
      setEditMode(false);
      setPost((prev) =>
        prev ? { ...prev, title, content, imageUrl: newImageUrl } : null
      );
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
          <Label>Image</Label>
          <Input type='file' onChange={handleImageChange} ref={fileInputRef} />
          {image && (
            <RemoveImageButtonContainer>
              <Button onClick={handleImageRemove}>Remove Image</Button>
            </RemoveImageButtonContainer>
          )}
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
          {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
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
