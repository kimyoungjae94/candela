import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';

const Container = styled.div`
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

const Error = styled.div`
  color: red;
  margin-bottom: 20px;
`;

export default function TravelCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [imageError, setImageError] = useState('');
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageError(''); // Reset image error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (title.trim() === '') {
      setTitleError('Title is required');
      valid = false;
    } else {
      setTitleError('');
    }

    if (content.trim() === '') {
      setContentError('Content is required');
      valid = false;
    } else {
      setContentError('');
    }

    if (!image) {
      setImageError('Image is required');
      valid = false;
    } else {
      setImageError('');
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

    const postRef = await addDoc(collection(db, 'posts'), {
      title,
      content,
      imageUrl,
      createdAt: serverTimestamp(),
      author: user?.displayName || 'Anonymous',
      authorId: user?.uid,
    });

    navigate('/travel', {
      state: {
        newPost: {
          id: postRef.id,
          title,
          content,
          imageUrl,
          createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
          author: user?.displayName || 'Anonymous',
          authorId: user?.uid,
        },
      },
    });
  };

  return (
    <Container>
      <h1>Create Post</h1>
      <Form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        {titleError && <Error>{titleError}</Error>}

        <Label>Content</Label>
        <TextArea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {contentError && <Error>{contentError}</Error>}

        <Label>Image</Label>
        <Input type='file' onChange={handleImageChange} />
        {imageError && <Error>{imageError}</Error>}

        <Button type='submit'>Submit</Button>
      </Form>
    </Container>
  );
}
