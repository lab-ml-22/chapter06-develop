import React from 'react'

interface PageNationProps {
    nowPage: number;
    totalPage: number;
    onNumberGroupHandler: (changeNumber: number) => void;
    onChangePage: (pageNumber: number) => void;
}

function PageNation({nowPage, totalPage, onNumberGroupHandler, onChangePage}: PageNationProps): JSX.Element {
    const onPageNumHandler = (param: number): void => { // 부모에서 전달받은 props(함수형태)에다가 클릭핸들러함수의 파라미터를 props로 전달받은 콜백함수의 인자로 전달
// console.log(`param = ${param}`);
        onChangePage(param)        
    }  

    // 페이징그룹안에 있는 페이지를 5개씩 자름
    const pageGroupSize: number = 5;
    
    // 현재그룹에 대한 인덱스    
    const pageGroupIndex: number = Math.floor((nowPage-1) / pageGroupSize) // -1은 인덱스가 0부터 시작하니까(페이지는 1부터지만, 인덱스는 0부터 시작이니까)
   
    // 5개씩 쪼개진 페이징그룹에서 첫번째 숫자
    const groupStartNum: number = pageGroupSize * pageGroupIndex + 1 // pageGroupSize가 0부터 시작하니까 +1을 해줘야함

    // 5개씩 쪼개진 페이징그룹에서 마지막 숫자(ex, totlaPage가 12, groupStartNum이 11, pageGroupSize가 5이면 11+5 = 16 근데, 5개씩쪼개야 해서 15가 나와야하니까 -1)
    const groupLastNum: number = Math.min(groupStartNum + pageGroupSize -1, totalPage)

    const onNextPage = (): void => {
        if(nowPage < totalPage) {
            if(nowPage % pageGroupSize === 0) { // (ex, 다음페이지가 '5'일때 '>'을 클릭하면 다음페이징그룹으로 이동해야하니까)
                onNumberGroupHandler(nowPage + 1)
            } else {
                onChangePage(nowPage + 1)
            }
        }
    }

    const onPrevPage = (): void => {   
        if(nowPage > 1) {
            if(nowPage % pageGroupSize === 0) { // (ex, 현재페이지가'6'일때 '<'을 클릭하면 이전페이징그룹으로 이동해야하니까)
                onNumberGroupHandler(nowPage - 1)
            } else {
                onChangePage(nowPage - 1)
            }
        } 
    }

    const onPageGroupNext = (): void => {                
        if(nowPage < totalPage) {            
            if(nowPage % pageGroupSize === 1 || nowPage % pageGroupSize === 0) {                           
                onNumberGroupHandler(nowPage + 5)
            }
            // 마지막페이징그룹의 첫번째 숫자에 5를 전체페이지의 수보다 크면, +5를 안한다
            if(nowPage + 5 > totalPage) {
                onNumberGroupHandler(totalPage)
            }
        }
    }

    const onPageGroupPrev = (): void => {
        if(nowPage > 1) {            
            if(nowPage % pageGroupSize === 1) {
                onNumberGroupHandler(nowPage - 5)
            }
            if(nowPage === totalPage) {
                let exceptPrevNum = 0
                if(totalPage % 2 === 0){ // totalPage가 짝수일때
                    exceptPrevNum = Math.floor(totalPage/pageGroupSize)+1
                    onNumberGroupHandler(totalPage-exceptPrevNum)
                } else {
                    exceptPrevNum = Math.floor(totalPage/pageGroupSize)
                    onNumberGroupHandler(totalPage-exceptPrevNum)
                }
            }
            // 첫번째페이지가 1일때에는 -1을 안한다
            if(nowPage === 1){
                onNumberGroupHandler(nowPage)
            }
        }
    }
    return (
    <div className="paging-box">
        <ol>
            <li className="prev"><button onClick={() => onPageGroupPrev()}>&lt;&lt;</button></li>
            <li className="prev"><button onClick={() => onPrevPage()}>&lt;</button></li>
            {                
                Array.from({length:groupLastNum - groupStartNum+1}, (_, index) => { // +1을해주는건 ex, 10 - 6을하면 4인데, 총 5개씩 페이징이 보여져야 하므로
                    // const pageNum = (pageGroupIndex * 5) + index + 1
                    const pageNum = groupStartNum + index
                    // console.log(`pageNum = ${pageNum}`);
                    return <li key={index}><button className={pageNum===nowPage ? 'active':''} onClick={() => onPageNumHandler(pageNum)}>{pageNum}</button></li>
                })               
            }
            <li className="next"><button onClick={() => onNextPage()}>&gt;</button></li>
            <li className="next"><button onClick={() => onPageGroupNext()}>&gt;&gt;</button></li>
        </ol>
    </div>
    )
}

export default PageNation
