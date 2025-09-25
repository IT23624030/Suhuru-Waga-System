import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import "./Notice.css";

function Notice(props) {
    const { type, title, content } = props.notice;

    const deleteHandler = async () => {
        await axios.delete(`http://localhost:5000/notices/${props.notice._id}`)
            .then(res => res.data)
            .then(() => {
                if (props.onDelete) {
                    props.onDelete(props.notice._id); // Remove from UI
                }
            });
    };

    const getNoticeColor = (noticeType) => {
        const lowerCaseType = noticeType.toLowerCase();
        if (lowerCaseType.includes("financial")) {
            return "financial";
        } else if (lowerCaseType.includes("training") || lowerCaseType.includes("workshop")) {
            return "training";
        } else if (lowerCaseType.includes("seed") || lowerCaseType.includes("fertilizer")) {
            return "seed";
        }
        return "default";
    };

    const typeClass = getNoticeColor(type);

    return (
        <div>
            <p className={`notice-type ${typeClass}`}>{type}</p>
            <h3>Title: {title}</h3>
            <p>Content: {content}</p>
            <div className="notice-actions">
                <Link to={`/notices/${props.notice._id}`} className="edit-button">Edit</Link>
                <button onClick={deleteHandler} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default Notice;