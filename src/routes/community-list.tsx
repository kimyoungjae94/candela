import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../styles/pagination.css';

const Container = styled.div`
  padding: 20px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
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

const WriteButtonContainer = styled.div`
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [location.search]);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = qandas.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    navigate(`/community-list?page=${event.selected}`);
  };

  const handleRowClick = (postId: string) => {
    navigate(`/community-detail/${postId}`);
  };

  const handleWriteClick = () => {
    navigate('/community-form');
  };

  return (
    <Container>
      <TableContainer>
        <Title>Community</Title>
        <WriteButtonContainer>
          <WriteButton onClick={handleWriteClick}>글쓰기</WriteButton>
        </WriteButtonContainer>
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
                <Td>{indexOfFirstItem + index + 1}</Td>
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
      </TableContainer>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(qandas.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        forcePage={currentPage}
      />
    </Container>
  );
};

export default CommunityList;
