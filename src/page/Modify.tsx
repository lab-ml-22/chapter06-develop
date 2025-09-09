import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useLocation, useNavigate} from "react-router-dom"
import { Board, BoardFormData } from '../types/board';

function Modify(): JSX.Element {
  let today = new Date()
  // 날짜(년-월-일)
  let year = today.getFullYear()
  let month = ('0' + (today.getMonth() + 1)).slice(-2)
  let day = ('0' + today.getDate()).slice(-2)
  let dateString = year + '-' + month  + '-' + day
  // 시간(시:분:초)
  let hours = ('0' + today.getHours()).slice(-2)
  let minutes = ('0' + today.getMinutes()).slice(-2)
  let seconds = ('0' + today.getSeconds()).slice(-2) 
  let timeString = hours + ':' + minutes  + ':' + seconds

  let modifyDate = dateString + '\u00A0' + timeString

  //  해당 글 번호에 해당하는 게시글 갖고오기
  const location = useLocation();
  let getBoardId: string = ''
  if(location.state !== null) {
      getBoardId = location.state.id
  } else {
      getBoardId = ''
  }

  const queryStr = new URLSearchParams(location.search);
  const pages = queryStr.get('_page');
  const qustrNowPage = location.state?.page || pages

  console.log(`qustrNowPage = ${qustrNowPage}`);
  
  // const refresh_checkcheck = location.state.refresh1
  // console.log(`refresh_checkcheck는 = ${refresh_checkcheck}`); // false로찍히고있고, 수정완료되면, view에서 console.log에 true라고 나옴
  // 아래 view로 수정사항 통신할떄 state에 들어가는 'refresh1'을 확인하려고 위에 'refresh_checkcheck'변수만들어서 확인해본거임

  const [eachBoard, setEachBoard] = useState<Board>({ // (★중요★)아래 state들을 빈값으로 초기화시켜준건 input과 textarea에 대해서 unControll상태 -> controll상태로 변경되었을때 콘솔에 warning이 찍히는걸 방지하기위해
    id: '',
    title: '',
    author: '',
    contents: '',
    count: 0,
    registerDate: ''
  })
    
  useEffect(() => { // 화면에 가장 처음 렌더링 할때만 실행하면 된다고 생각해서 빈배열을 넣은 useEffect를 씀
      if(getBoardId) { // getBoardId이게 유효한 경우에만 실행
        axios.get(`http://localhost:3001/board/${getBoardId}`)
          .then(response => {
              // console.log(`response.data = ${JSON.stringify(response.data)}`);
              setEachBoard(response.data)
          })
          .catch(error => {
              console.error(error)
          })
      }
  }, [getBoardId]) // 의존성배열에 id담은 이유는 첨 렌더링할때 한번만 설정되기때문에 일반적으론, 변경되지 않음

  const navigate = useNavigate()
  const onCancelModify = (): void => {
    alert(`수정을 취소하였습니다. 목록으로 이동합니다`);
        navigate(`/lists?_page=${qustrNowPage}`)
  }

  const [updateInsert, setUpdateInsert] = useState<BoardFormData>({
    title: '', // 업데이트해야하니까 처음엔 빈값으로 = 업데이트 할 공간을 만들어준다
    author: '',
    contents: ''
  })
  const {title, author, contents} = updateInsert

  useEffect(() => { // (★중요★) 의존성배열안에 넣은 eachBoard의 항목이 업데이트가 되면, updateInsert에도 해당항목이 업데이트가 된다
    setUpdateInsert({
      title: eachBoard.title,
      author: eachBoard.author,
      contents: eachBoard.contents
    })
  }, [eachBoard]) // eachBoard이게 바뀔때 updateInsert에 해당 state값들을 업데이트하겠다

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUpdateInsert({
      ...updateInsert, // 제목을 수정하더라도, 제목을 제외한 나머지 입력값들은 그대로 유지(바꿀지 안바꿀지 모르니까)
      title:e.target.value
    })
  }
    
  const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUpdateInsert({
      ...updateInsert,
      author: e.target.value
    })
  }  

  const onContentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setUpdateInsert({
      ...updateInsert,
      contents: e.target.value
    })
  }
  
  const onFinishModify = async (): Promise<void> => {
// console.log(`getBoardId = ${getBoardId}`);
    
    try {
      await axios.put(`http://localhost:3001/board/${getBoardId}`, {
        id: eachBoard.id,
        title: title,
        author: author,
        contents: contents,
        count: eachBoard.count,
        registerDate: eachBoard.registerDate, // 기존 작성일을 유지한다
        modifyDate: modifyDate // 수정일은 현재일과 똑같이
      })
      console.log(`수정되었습니다`);
      navigate(`/view?id=${getBoardId}&page=${qustrNowPage}`, {
        state: {
          id: getBoardId,
          refresh1: true,
          page: qustrNowPage
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="modify-contents-box">
        <div className="top">
            <span className="title"><input type="text" value={title} placeholder="제목" onChange={onTitleChange}/></span>
            <span className="author"><input type="text" value={author} placeholder="작성자" onChange={onAuthorChange}/></span>
        </div>
        <div className="middle">
            <span className="contents"><textarea placeholder="내용" value={contents} onChange={onContentsChange}/></span>
        </div>
        <div className="bottom">
            <button onClick={onFinishModify}>수정완료하기</button>
            <button onClick={onCancelModify}>수정취소하기</button>
        </div>
    </div>
  )
}

export default Modify
