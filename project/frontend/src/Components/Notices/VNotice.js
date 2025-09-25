import React from 'react';
import './VNotices.css';

function VNotice(props) {
  const { type, title, content } = props.notice;

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
    <div className="notice">
      <p className={`notice-type ${typeClass}`}>{type}</p>
      <h3 className="notice-title">{title}</h3>
      <p className="notice-content">{content}</p>
    </div>
  );
}

export default VNotice;