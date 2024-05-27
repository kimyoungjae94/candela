import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';

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

const ErrorMessage = styled.span`
  color: red;
  margin-bottom: 10px;
`;

export default function CommunityForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (title.trim() === '') {
      setTitleError('Title is required.');
      hasError = true;
    } else {
      setTitleError('');
    }

    if (content.trim() === '') {
      setContentError('Content is required.');
      hasError = true;
    } else {
      setContentError('');
    }

    if (hasError) {
      return;
    }

    if (user) {
      await addDoc(collection(db, 'qandas'), {
        title,
        content,
        author: user.displayName,
        views: 0,
        createdAt: serverTimestamp(),
      });

      navigate('/community-list');
    }
  };

  return (
    <FormContainer>
      <h1>Create Post</h1>
      <Form onSubmit={handleSubmit}>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        {titleError && <ErrorMessage>{titleError}</ErrorMessage>}

        <Label>Content</Label>
        <TextArea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {contentError && <ErrorMessage>{contentError}</ErrorMessage>}

        <Button type='submit'>Submit</Button>
      </Form>
    </FormContainer>
  );
}
