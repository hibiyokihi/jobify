import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();
  // dataをdestructureして、dataを更にdestructureしてもいいが、このように１行でも書ける。
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });
  // Array.from(arrayLike, mapFn)
  // 本来の使い方としては、第一引数にiterableなものを置いて、mapFnでその要素を一つずつ取り出して加工してArrayを返す。
  // 第一引数を上記のようにすると、undefinedが指定したlength分ならんだArrayができる。
  // mapFnに引数を2つ置いた場合、2つ目はindex。ここではindexだけ使いたいから、第1引数は_としている。
  // 結果、要素の数がnumOfPages、１からnumOfPagesの数までのArrayができる。

  const { search, pathname } = useLocation();
  // searchはその時点のquery-paramsを返す。pathnameはその名の通り現時点のpathnameを返す。
  const navigate = useNavigate();

  const handlePageChange = (pageNum) => {
    const searchParams = new URLSearchParams(search);
    // URLSearchParamsインスタンスは、url内のquery-paramsに対する操作を可能にするメソッドを持つ。
    // ここでは、現時点のquery-paramsをURLSearchParamsに渡して操作可能にして、setメソッドを適用する。
    searchParams.set('page', pageNum);
    // URLSearchParamsのsetメソッドは、query-paramsにクエリを追加する。引数にはkeyとvalueを渡す。
    navigate(`${pathname}?${searchParams.toString()}`);
    // 作成したsearchParamsはquery-params部分でありpathは持たないから、pathと繋げる必要がある。
    // navigateするにはstringに変換する必要があり、クエリ頭の?を付けてpathと繋げる。
  };

  // 下記addPageButtonとrenderPageButtonsは、ページ切替の表示数を減らす方法を取る場合に作成する。
  // 総ページ数が少ない場合には全ページを表示する形で問題なく、その場合はもっとシンプル。CodeはREADMEファイルを参照(5880行から)。
  const addPageButton = ({ pageNum, activeClass }) => {
    return (
      <button
        key={pageNum}
        className={`btn page-btn ${activeClass && 'active'}`}
        onClick={() => handlePageChange(pageNum)}
        // onClickの関数に引数を渡したい時はcall-backの形にすること。
        // 例えば2ページ目のボタンのpageNumは2で、クリックされるとquery-paramsのpageに2がセットされ、
        // navigateがall-jobsにアクセスすることでloaderが発動し、page付きのqueryがサーバーに送られる。
      >
        {pageNum}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    pageButtons.push(
      addPageButton({ pageNum: 1, activeClass: currentPage === 1 })
      // １ページ目のボタン。
      // currentが１ページ目ならactiveにする。
    );
    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ...
        </span>
        // currentが４ページ目以降の場合に、１の隣が...になる。
      );
    }
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({ pageNum: currentPage - 1, activeClass: false })
        // currentPageの1つ前のボタン
        // currentが１の時は０だから不要。２の時は１で既に表示されてるから不要。currentではないから非active。
      );
    }
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        addPageButton({ pageNum: currentPage, activeClass: true })
        // currentPageのボタン
        // currentが１の時は既に表示されてるから不要。currentが最終ページの時も同様。activeにする。
      );
    }
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(
        addPageButton({ pageNum: currentPage + 1, activeClass: false })
        // currentPageの1つ後のボタン
        // currentが最終の時は次は無いから不要。最終の1つ前の場合は次は最終で、既に表示されてるから不要
      );
    }
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className="page-btn dots" key="dots+1">
          ...
        </span>
        // currentが最終ページの２ページ前より前の場合に、最終ページの隣が...になる。
      );
    }
    pageButtons.push(
      addPageButton({
        pageNum: numOfPages,
        activeClass: currentPage === numOfPages,
        // 最終ページのボタン
        // currentが最終ページならactiveにする。
      })
    );

    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
          // ここでは、１ページ目でprevを押したら最後のページに飛ぶようにする。
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {renderPageButtons()}
        {/* invokeしてるからコンポのレンダー時にも実行され、currentPageに合わせてページボタンが表示される */}

        {/* ...を使わずに全ページを表示するシンプルバージョンの場合のコードは下記の通り。
        {pages.map((pageNum) => addPageButton(pageNum))} */}
      </div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
          // ここでは、最終ページでnextを押したら1ページ目にリンクするようにする。
        }}
      >
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
