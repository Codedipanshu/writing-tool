import React, { useRef, useState } from "react";
import { Card, Input, Upload, Button, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { useDrop, useDrag } from "react-dnd";
import { runes } from "runes2";

const Block = ({
  index,
  block,
  onDelete,
  onContentChange,
  onImageChange,
  onMove,
}) => {
  const ref = useRef(null);
  const [isEditing, setEditing] = useState(false);
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);

  const [, drop] = useDrop({
    accept: "BLOCK",
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "BLOCK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const toggleBold = () => {
    setBold(!isBold);
  };

  const toggleItalic = () => {
    setItalic(!isItalic);
  };

  const toggleUnderline = () => {
    setUnderline(!isUnderline);
  };

  const renderEditingTools = () => {
    return (
      <div className="editing-tools">
        <Tooltip title="Bold">
          <Button
            shape="circle"
            icon={
              <BoldOutlined style={{ color: isBold ? "white" : "black" }} />
            }
            style={{ backgroundColor: isBold ? "black" : "white" }}
            onClick={toggleBold}
          />
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            shape="circle"
            icon={
              <ItalicOutlined style={{ color: isItalic ? "white" : "black" }} />
            }
            style={{ backgroundColor: isItalic ? "black" : "white" }}
            onClick={toggleItalic}
          />
        </Tooltip>
        <Tooltip title="Underline">
          <Button
            shape="circle"
            icon={
              <UnderlineOutlined
                style={{ color: isUnderline ? "white" : "black" }}
              />
            }
            style={{ backgroundColor: isUnderline ? "black" : "white" }}
            onClick={toggleUnderline}
          />
        </Tooltip>
      </div>
    );
  };

  const Extras = () => {
    return (
      <>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(block.id)}
        />
        <Button type="text" icon={<EditOutlined />} onClick={handleEdit} />
      </>
    );
  };
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Card
        ref={ref}
        title={`Block ${index + 1}`}
        extra={hover ? <Extras /> : null}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {isEditing ? (
          <>
            {block.type === "text" ? (
              <>
                {renderEditingTools()}
                <Input.TextArea
                  value={block.content}
                  onChange={(e) => onContentChange(block.id, e.target.value)}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  count={{
                    show: true,
                    max: 250,
                    strategy: (txt) => runes(txt).length,
                    exceedFormatter: (txt, { max }) =>
                      runes(txt).slice(0, max).join(""),
                  }}
                />
              </>
            ) : (
              <Upload
                customRequest={() => {}}
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onImageChange(block.id, reader.result);
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<SaveOutlined />}>Upload Image</Button>
              </Upload>
            )}
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <>
            {block.type === "text" ? (
              <div
                style={{
                  fontWeight: isBold ? "bold" : "normal",
                  fontStyle: isItalic ? "italic" : "normal",
                  textDecoration: isUnderline ? "underline" : "none",
                }}
              >
                {block.content}
              </div>
            ) : (
              <>
                <img
                  src={block.image}
                  alt="Block"
                  style={{ maxWidth: "100%" }}
                />
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Block;
