import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
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

const CommentList = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const EditTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ErrorMessage = styled.span`
  color: red;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.p`
  margin: 0;
`;

const CommentContent = styled.p`
  margin: 0;
  margin-top: 10px;
`;

const CommentDate = styled.small`
  position: absolute;
  right: 10px;
  top: 10px;
  color: #777;
`;

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

const Comments = ({ postId }: { postId: string }) => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    const commentsRef = collection(db, 'qandas', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      setContentError('댓글 내용이 필요합니다.');
      return;
    }

    if (!user) {
      alert('로그인 이후 댓글 이용이 가능합니다.');
      return;
    }

    const commentsRef = collection(db, 'qandas', postId, 'comments');
    await addDoc(commentsRef, {
      author: user.displayName,
      content,
      createdAt: serverTimestamp(),
    });
    setContent('');
    setContentError('');
  };

  const handleEditSubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (editCommentId && window.confirm('댓글을 수정하시겠습니까?')) {
      const commentRef = doc(db, 'qandas', postId, 'comments', commentId);
      await updateDoc(commentRef, {
        content: editContent,
      });
      setEditCommentId(null);
      setEditContent('');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const commentRef = doc(db, 'qandas', postId, 'comments', commentId);
      await deleteDoc(commentRef);
    }
  };

  return (
    <Container>
      <h2>댓글</h2>
      {user ? (
        <CommentForm onSubmit={handleSubmit}>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder='댓글을 작성하세요...'
          />
          {contentError && <ErrorMessage>{contentError}</ErrorMessage>}
          <Button type='submit'>Submit</Button>
        </CommentForm>
      ) : (
        <p>로그인 이후 댓글 이용이 가능합니다.</p>
      )}
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            {editCommentId === comment.id ? (
              <CommentForm onSubmit={(e) => handleEditSubmit(e, comment.id)}>
                <EditTextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                />
                <ButtonContainer>
                  <Button type='submit'>저장</Button>
                  <Button onClick={() => setEditCommentId(null)}>취소</Button>
                </ButtonContainer>
              </CommentForm>
            ) : (
              <>
                <CommentAuthor>
                  <strong>{comment.author}</strong>
                </CommentAuthor>
                <CommentDate>
                  {comment.createdAt
                    ? new Date(
                        comment.createdAt.seconds * 1000
                      ).toLocaleString()
                    : 'Loading...'}
                </CommentDate>
                <CommentContent>{comment.content}</CommentContent>
                {user?.displayName === comment.author && (
                  <ButtonContainer>
                    <Button
                      onClick={() => {
                        setEditCommentId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      수정
                    </Button>
                    <Button onClick={() => handleDelete(comment.id)}>
                      삭제
                    </Button>
                  </ButtonContainer>
                )}
              </>
            )}
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
};

export default Comments;
