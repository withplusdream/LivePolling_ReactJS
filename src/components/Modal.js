import React, { useState } from "react";
import { Box, Modal, Typography, InputAdornment } from "@mui/material";
import { useCookies } from "react-cookie";

import { ModalButton } from "./Button";
import { NeumorphismTextField } from "./TextField";
import { ModalPaper } from "./Paper";
import { socket } from "./../utils/socket";

export const DeleteModal = (props) => {
  const { open, handleModal, count, deletePolls } = props;

  return (
    <Modal open={open}>
      <ModalPaper sx={{ p: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>
            {count}개의 데이터를 삭제하시겠습니까?
          </Typography>
          <Typography>삭제되는 데이터는 영구적으로 삭제되고 복구가 불가능합니다.</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "auto" }}>
          <ModalButton sx={{ color: "red", mx: "3px" }} onClick={deletePolls}>
            삭제
          </ModalButton>
          <ModalButton sx={{ color: "black", mx: "3px" }} onClick={handleModal}>
            취소
          </ModalButton>
        </Box>
      </ModalPaper>
    </Modal>
  );
};

export const CreateModal = (props) => {
  const { open, handleModal } = props;
  const [cookies] = useCookies();
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState(false);

  const handleProjectName = (e) => {
    if (error) setError(false);
    if (e.target.value.length > 25) {
      setProjectName(e.target.value.slice(0, 25));
    } else {
      setProjectName(e.target.value);
    }
  };
  const createProjectName = () => {
    if (projectName === "") {
      setError(!error);
      return;
    }
    socket.emit("createProject", { name: projectName, admin: cookies.auth });
  };
  return (
    <Modal open={open} onClose={handleModal}>
      <ModalPaper sx={{ p: 4, width: "400px" }}>
        <Box sx={{ mb: 2 }}>
          <Typography>생성할 프로젝트 이름을 입력해주세요.</Typography>
          <NeumorphismTextField
            fullWidth
            size="small"
            placeholder="프로젝트 이름"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{25 - projectName.length}</InputAdornment>
              ),
            }}
            helperText={error ? "프로젝트 이름을 입력해주세요." : ""}
            error={error}
            value={projectName}
            onChange={handleProjectName}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "auto" }}>
          <ModalButton sx={{ color: "blue", mx: "3px" }} onClick={createProjectName}>
            생성
          </ModalButton>
          <ModalButton sx={{ color: "black", mx: "3px" }} onClick={handleModal}>
            취소
          </ModalButton>
        </Box>
      </ModalPaper>
    </Modal>
  );
};
