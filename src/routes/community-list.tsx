import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 1px solid #ddd;
  padding: 10px;
`;

const Td = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  text-align: center;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const WriteButton = styled.button`
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
  author: string;
  views: number;
  imageUrl?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const CommunityList = () => {
  const [qandas, setQandas] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQandas = async () => {
      const q = query(collection(db, 'qandas'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const qandaList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setQandas(qandaList);
    };

    fetchQandas();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = qandas.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (postId: string) => {
    navigate(`/community-detail/${postId}`);
  };

  const handleWriteClick = () => {
    navigate('/community-form');
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <Th>No</Th>
            <Th>제목</Th>
            <Th>조회수</Th>
            <Th>글쓴이</Th>
            <Th>작성시간</Th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id} onClick={() => handleRowClick(item.id)}>
              <Td>{index + 1}</Td>
              <Td>{item.title}</Td>
              <Td>{item.views}</Td>
              <Td>{item.author}</Td>
              <Td>
                {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(Math.ceil(qandas.length / itemsPerPage)).keys()].map(
          (number) => (
            <Button key={number + 1} onClick={() => handleClick(number + 1)}>
              {number + 1}
            </Button>
          )
        )}
      </Pagination>
      <ButtonContainer>
        <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
      </ButtonContainer>
    </Container>
  );
};

export default CommunityList;
