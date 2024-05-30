import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

const FormContainer = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
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
  resize: none;
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

export default function CommunityForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm('게시물을 등록하시겠습니까?')) {
      return;
    }

    let valid = true;

    if (title.trim() === '') {
      setTitleError('제목을 작성하세요.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (content.trim() === '') {
      setContentError('내용을 작성하세요.');
      valid = false;
    } else {
      setContentError('');
    }

    if (!valid) {
      return;
    }

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, 'qandas'), {
      title,
      content,
      imageUrl,
      author: user?.displayName || 'Anonymous',
      authorId: user?.uid,
      views: 0,
      createdAt: serverTimestamp(),
    });

    navigate('/community-list');
  };

  const handleImageRemove = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Label>제목</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        {titleError && <Error>{titleError}</Error>}

        <Label>내용</Label>
        <TextArea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {contentError && <Error>{contentError}</Error>}

        <Label>이미지</Label>
        <ImageInputContainer>
          <Input type='file' onChange={handleImageChange} ref={fileInputRef} />
          {image && (
            <RemoveImageButton type='button' onClick={handleImageRemove}>
              취소하기
            </RemoveImageButton>
          )}
        </ImageInputContainer>

        <Button type='submit'>저장하기</Button>
      </Form>
    </FormContainer>
  );
}
