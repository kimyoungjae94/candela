import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import Comments from './community-comments';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin: 0;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 16px;
  color: #555;
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
  resize: none;
`;

const Input = styled.input`
  width: 100%;
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

const ImageInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  right: 10px;
  padding: 5px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const Error = styled.div`
  color: red;
  margin-bottom: 20px;
`;

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string; // authorId 필드를 추가합니다.
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
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
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

          // Increase view count
          await updateDoc(postRef, {
            views: (postData.views || 0) + 1,
          });
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
    if (title.trim() === '') {
      setTitleError('Title is required');
      return;
    } else {
      setTitleError('');
    }

    if (content.trim() === '') {
      setContentError('Content is required');
      return;
    } else {
      setContentError('');
    }

    if (postId) {
      const confirmed = window.confirm('수정하시겠습니까?');
      if (confirmed) {
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
    }
  };

  const handleDelete = async () => {
    if (postId) {
      const confirmed = window.confirm('삭제하시겠습니까?');
      if (confirmed) {
        await deleteDoc(doc(db, 'qandas', postId));
        navigate('/community-list');
      }
    }
  };

  if (!post) {
    return <Container>Loading...</Container>;
  }

  const isAuthor = user?.uid === post.authorId;

  return (
    <Container>
      {editMode ? (
        <>
          <h1>제목 :</h1>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          {titleError && <Error>{titleError}</Error>}
          <p>내용 :</p>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
          {contentError && <Error>{contentError}</Error>}
          <Label>Image</Label>
          <ImageInputContainer>
            <Input
              type='file'
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {image && (
              <RemoveImageButton type='button' onClick={handleImageRemove}>
                취소
              </RemoveImageButton>
            )}
          </ImageInputContainer>
          <ButtonContainer>
            <Button onClick={handleSave}>저장</Button>
            <Button onClick={handleCancel}>취소</Button>
          </ButtonContainer>
        </>
      ) : (
        <>
          <Header>
            <Title>{post.title}</Title>
            <MetaInfo>
              <div>작성자: {post.author}</div>
              <div>
                작성일:{' '}
                {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
              </div>
              <div>조회수: {post.views}</div>
            </MetaInfo>
          </Header>
          <Divider />
          {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
          <Content>{post.content}</Content>
          {isAuthor && (
            <ButtonContainer>
              <Button onClick={handleEdit}>수정</Button>
              <Button onClick={handleDelete}>삭제</Button>
            </ButtonContainer>
          )}
          <Divider />
          <Comments postId={postId!} />
        </>
      )}
    </Container>
  );
}
