import { useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  totalUsers: number;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await fetch(`http://localhost:3001/users`);
  if (!res.ok) {
    return { props: { statusCode: res.status, users: [], totalUsers: 0 } };
  }

  const { users, total } = await res.json();
  return {
    props: {
      statusCode: 200,
      users: users || [],
      totalUsers: total,
    },
  };
};

export default function Home({ statusCode, users, totalUsers }: TGetServerSideProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  let startPage = 1;
  let endPage = 10;

  if (currentPage > 5) {
    startPage = currentPage - 4;
    endPage = currentPage + 5;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = totalPages - 9 > 0 ? totalPages - 9 : 1;
  }

  const pageNumbers = [...Array(endPage + 1 - startPage).keys()].map((i) => i + startPage);

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
              {pageNumbers.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} />
            </Pagination>
          </div>
        </Container>
      </main>
    </>
  );
}
