import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useQuery from "../hooks/useQuery";
import { RootState } from "../store";
import { fetchMoreSearchList, fetchSearchList } from "../store/home";
import Input from "./Input";
import Layout from "./Layout";
import ListItem from "./ListItem";

const Target = styled.div`
  height: 20px;
`;

const Search = () => {
  const term = useQuery() as string;
  const dispatch = useDispatch();

  const page = useRef<number>(1);
  const target = useRef<HTMLDivElement>(null);

  const { searchList, loading } = useSelector(
    (state: RootState) => state.home.search
  );

  const callback = (
    [entry]: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      page.current++;
      dispatch(fetchMoreSearchList({ page: page.current, term }));
    }
  };

  useIntersectionObserver(target, callback);

  useEffect(() => {
    page.current = 1;
    dispatch(fetchSearchList({ page: page.current, term }));
  }, [dispatch, term]);

  return (
    <>
      <Input />
      {loading ? (
        <></>
      ) : (
        <>
          <Layout>
            {searchList.map((item, index) => (
              <ListItem key={index} item={item} />
            ))}
          </Layout>
          <Target ref={target}></Target>
        </>
      )}
    </>
  );
};

export default Search;
