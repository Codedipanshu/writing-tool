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
import { runes } from "runes2";

const Block = ({ index, block, onDelete, onContentChange, onImageChange }) => {
  const ref = useRef(null);
  const [isEditing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const renderEditingTools = () => {
    return (
      <div className="editing-tools">
        <Tooltip title="Bold">
          <Button shape="circle" icon={<BoldOutlined />} />
        </Tooltip>
        <Tooltip title="Italic">
          <Button shape="circle" icon={<ItalicOutlined />} />
        </Tooltip>
        <Tooltip title="Underline">
          <Button shape="circle" icon={<UnderlineOutlined />} />
        </Tooltip>
      </div>
    );
  };

  return (
    <Card
      ref={ref}
      title={`Block ${index + 1}`}
      extra={
        <>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(block.id)}
          />
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit} />
        </>
      }
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
            <div>{block.content}</div>
          ) : (
            <>
              <img src={block.image} alt="Block" style={{ maxWidth: "100%" }} />
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default Block;
