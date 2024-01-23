import React, { useState } from "react";
import { Button, Space } from "antd";
import "./App.css";
import Block from "./components/Block";

function App() {
  const [blocks, setBlocks] = useState([]);

  const addBlock = (type) => {
    const newBlock = {
      id: new Date().getTime(),
      type,
      content: type === "text" ? "" : null,
      image: type === "picture" ? null : "",
    };

    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks.push(newBlock);
      return updatedBlocks;
    });
  };

  const deleteBlock = (id) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(updatedBlocks);
  };

  const updateBlockContent = (id, content) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updatedBlocks);
  };

  const updateBlockImage = (id, image) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, image } : block
    );
    setBlocks(updatedBlocks);
  };

  const moveBlock = (dragIndex, hoverIndex) => {
    const draggedBlock = blocks[dragIndex];
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, draggedBlock);
    setBlocks(updatedBlocks);
  };

  return (
    <div className="app">
      <Space direction="vertical" style={{ width: "100%", padding: "20px" }}>
        {blocks.map((block, index) => (
          <Block
            key={block.id}
            index={index}
            block={block}
            onDelete={deleteBlock}
            onContentChange={updateBlockContent}
            onImageChange={updateBlockImage}
            onMove={moveBlock}
          />
        ))}
      </Space>
      <div className="add-block-btn">
        <Button onClick={() => addBlock("text")}>Add Text Block</Button>
        <Button onClick={() => addBlock("picture")}>Add Picture Block</Button>
      </div>
    </div>
  );
}

export default App;
