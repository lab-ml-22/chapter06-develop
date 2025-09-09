import React, { useEffect, useState } from 'react'
import {useNavigate, useLocation} from "react-router-dom"
import PageNation from './PageNation';
import axios from 'axios';
import { Board } from '../types/board';

function Lists(): JSX.Element { 
     const [contentsSorting, setContentsSorting] = useState<Board[]>([])

    const navigate = useNavigate()
    const location = useLocation()

// const location = useLocation()
// const states = location.state;
// console.log(`states = ${JSON.stringify(states)}`);
    
    const onNewWrite = (): void => {
        navigate("/insert") // Insert.tsx로 화면넘기기
    }

    const thArr: string[] = ['번호', '제목', '작성자', '조회수', '등록일', '수정일']
    const pageBoardCount: number = 5; // 한페이지당 가져와야 하는 글의 갯수
    const [nowPage, setNowPage] = useState<number>(1) // 현재페이지
    const [totalPage, setTotalPage] = useState<number>(0) // 총페이지수

    // 2025-01-12글리치랑 연동시키려고 페이징처리수정[s]
    // 페이지 링크 정보를 추출하는 함수
    const calculateTotalPages = (linkHeader: string): number => {
        const links = linkHeader.split(',')
        const lastLinks = links.find(link => link.includes('rel="last"'))
        if(lastLinks) {
            const lastPageMath = lastLinks.match(/_page=(\d+)/) // listLink는 Link헤더에서 'last'라는 관계(rel)을 가진 링크
                                                                // _page라는 문자열을 찾아서 하나이상의 숫자를 찾는다, 이 숫자는 페이지 번호를 나타냄 (\d는 숫자)
console.log(`lastPageMath = ${JSON.stringify(lastPageMath)}`);
            if(lastPageMath) {
                return parseInt(lastPageMath[1], 10)
            }
        }
        return 1 // 이거는 last링크를 찾지 못하거나 페이지를 추출하지 못했을 때 기본적으로 페이지 수를 1로 설정(=안전장치)
    }
    // 2025-01-12글리치랑 연동시키려고 페이징처리수정[e]

    // td에 들어갈 데이터 가져오기_useEffect로 의존성배열은 빈배열로 페이지 로드시, 한번만 불러옴
    useEffect(() => {
        navigate(`/lists?_page=${nowPage}`)
        // axios.get(`https://fallacious-chivalrous-date.glitch.me/board?_page=${nowPage}&_per_page=${pageBoardCount}&_sort=-registerDate`)  // 페이지 넘버링 바뀌면, 통신통해서 주소에 쿼리파라미터(= 형태는 이렇게 '?key=value')주기
        axios.get(`http://localhost:3001/board?_page=${nowPage}&_limit=${pageBoardCount}&_sort=registerDate&_order=desc`)
            .then(response => {
                setContentsSorting(response.data) // response.data안에 data라는 key를 가져옴
                // setTotalPage(response.data.pages)

                // Link헤더에서 총 페이지수 계산(2025-01-12글리치랑 연동시키려고 페이징처리수정[s])
                const headerLink = response.headers.link
// console.log(`headerLink = ${JSON.stringify(headerLink)}`);
                if(headerLink) {
                    const totalPage = calculateTotalPages(headerLink)
                    setTotalPage(totalPage)
                }
                // Link헤더에서 총 페이지수 계산(2025-01-12글리치랑 연동시키려고 페이징처리수정[e])
            })
            .catch(error => {
                console.error(error)
            })
    }, [nowPage, navigate]) // 의존성배열에 페이지넘버를 넣어서 페이지 클릭했을때 페이징의 번호를 쿼리파라미터(?key=value)형태로 주소에 넣어서 해당페이지에 해당하는 글의갯수를 가져온다
 
    //  내가 주소창에 직접 페이징넘버를 입력했을때 해당페이징에서 보여지는 글의 갯수를 가져온다
    useEffect(() => {
        const query = new URLSearchParams(location.search)
        const pages = query.get('_page')
        if(pages) {
            setNowPage(parseInt(pages, 10))
        }
    }, [location.search])

    // 게시글 클릭하면 해당 게시글 뷰 페이지로 이동
    const onLinktoBoard = (param: string): void => {
        const choiceBoard = contentsSorting.find(function(board) { // 게시글 클릭했을때 게시글의 id가 똑같은지 확인
            return board.id === param            
        })
        if (choiceBoard) {
            const countIncrement = choiceBoard.count + 1; // 똑같으면 해당 게시글의 카운트 증가
            // 증가된 카운트를 json-server에 업데이트하려면 통신해야지
            axios.put(`http://localhost:3001/board/${param}`, {
                ...choiceBoard,
                count: countIncrement
            })

            navigate(`/view?id=${param}&page=${nowPage}`, {
                state:{
                    id: param,
                    count: countIncrement,
                    page: nowPage
                }            
            })
        }
    }

    const onChangePage = (pageNumber: number): void => {
        // console.log(`onChangePage눌렸음`); // 자식컴포넌트에서 props로 전달한 함수가 제대로 작동하는지 확인
        // console.log(`pageNumber = ${pageNumber}`); // 자식컴포넌트에서 props로 전달한 함수의 인자값이 제대로 찍히는지 확인

        setNowPage(pageNumber)
    }
    // console.log(`nowPage = ${nowPage}`);

    const onNumberGroupChange = (changeNumber: number): void => {
        
    }

    return (
        <div className="board-lists">
            <div className="board-lists-title">
                <h1>게시판</h1>
            </div>
            <div className="board-lists-table">
                <table>
                    <thead>
                        <tr>
                            {thArr.map((th, index) => (
                                <th key={index}>{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {contentsSorting.map((board, index) => (
                            <tr key={board.id} onClick={() => onLinktoBoard(board.id)}>
                                <td>{(nowPage - 1) * pageBoardCount + index + 1}</td>
                                <td>{board.title}</td>
                                <td>{board.author}</td>
                                <td>{board.count}</td>
                                <td>{board.registerDate}</td>
                                <td>{board.modifyDate || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="board-lists-pagination">
                <PageNation 
                    totalPage={totalPage} 
                    nowPage={nowPage} 
                    onChangePage={onChangePage}
                    onNumberGroupHandler={onNumberGroupChange}
                />
            </div>
            <div className="board-lists-write">
                <button onClick={onNewWrite}>새 글작성</button>
            </div>
        </div>
    )
}

export default Lists
