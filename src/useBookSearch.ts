import { useEffect, useState } from "react";
import axios from "axios";
// import { stringify } from "querystring";

type Props = {
  query: string;
  pageNumber: number;
};

// type ForSetBooks = {
//   prevBooks: string;
// };

const useBookSearch = ({ query, pageNumber }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [books, setBooks] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: any;
    // let set = new Set();

    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks: string[]) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((b: any) => b.title),
            ]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
};

export default useBookSearch;
