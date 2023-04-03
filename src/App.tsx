import React, { useState, ChangeEvent, FC, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

const App: FC = () => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  // const params = { query: query, pageNumber: pageNumber };
  const { loading, error, books, hasMore } = useBookSearch({
    query,
    pageNumber,
  });

  const observer = useRef<any>();
  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type="text" onChange={handleSearch} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      {loading && "Loading..."}
      {error && "Error..."}
    </>
  );
};

export default App;
