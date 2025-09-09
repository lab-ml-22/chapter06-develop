import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import axios from 'axios';
// import { BoardFormData } from '../types/board';

function Insert(): JSX.Element {
    const [title, setTitle] = useState<string>('')
    const [author, setAuthor] = useState<string>('')
    const [contents, setContents] = useState<string>('')

    const onTitleInsert = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value)
    }

    const onAuthorInsert = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAuthor(e.target.value)
    }

    const onContentsInsert = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setContents(e.target.value)
    }

    // 현재 날짜와 시간을 가져오는 함수
    const getCurrentDateTime = (): string => {
        const today = new Date()
        const year = today.getFullYear()
        const month = ('0' + (today.getMonth() + 1)).slice(-2)
        const day = ('0' + today.getDate()).slice(-2)
        const hours = ('0' + today.getHours()).slice(-2)
        const minutes = ('0' + today.getMinutes()).slice(-2)
        const seconds = ('0' + today.getSeconds()).slice(-2)
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    const navigate = useNavigate();

    const onRegister = async (): Promise<void> => {
        try {
                await axios.post("http://localhost:3001/board", {
                    title: title,
                    author: author,
                    contents: contents,
                    count: 0,
                    registerDate: getCurrentDateTime()
                })
                console.log(`등록되었습니다`);            
                navigate("/lists");
        } catch (error) {
                console.error(error);                        
        } 
    }

    const onCancle = (): void => {
        console.log(`글등록을 취소하였습니다, 이전페이지로 돌아갑니다`);
        navigate(-1);        
    }
    return (
        <div className="insert-contents-box">
            <div className="top">
                <span className="title"><input type="text" value={title} placeholder="제목" onChange={onTitleInsert}/></span>
                <span className="author"><input type="text" value={author} placeholder="작성자" onChange={onAuthorInsert}/></span>
            </div>
            <div className="middle">
                <span className="contents"><textarea placeholder="내용" value={contents} onChange={onContentsInsert}/></span>
            </div>
            <div className="bottom">
                <button onClick={onRegister}>등록하기</button>
                <button onClick={onCancle}>취소하기</button>
            </div>
        </div>
    )
}

export default Insert
