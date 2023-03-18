import React, { useState, useEffect } from "react";
import { Box, Typography, Tooltip, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";

import { IconButton, ManagerButton, ActionButton } from "./../../components/Button";
import { DeleteModal, CreateModal } from "./../../components/Modal";
import Header from "./../../components/Header";
import SideBar from "./../../components/SideBar";
import { ListPaper } from "./../../components/Paper";
import { neumorphism } from "../../styles/ui";
import { socket } from "./../../utils/socket";

const Content = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [rows, setRows] = useState([]);
  const [rowsModified, setRowsModified] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [createPollModalIsOpened, setCreatePollModalIsOpened] = useState(false);
  const [removePollModalIsOpened, setRemovePollModalIsOpened] = useState(false);

  const columns = [
    { field: "name", headerName: "이름", flex: 2 },
    { field: "type", headerName: "타입", flex: 1 },
    { field: "created", headerName: "생성 날짜", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Tooltip title="수정" arrow>
                <ActionButton id={params.id} size="small" onClick={goEditPage}>
                  <EditIcon sx={{ color: "#000000b0" }} />
                </ActionButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="시작" arrow>
                <ActionButton
                  id={params.id}
                  size="small"
                  onClick={goSlidePage}
                  value={params.row.type}
                >
                  <PlayCircleIcon sx={{ color: "#000000b0" }} />
                </ActionButton>
              </Tooltip>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const handleCheckList = (list) => {
    setCheckedList([...list]);
  };
  const resetCheckBoxList = () => {
    setCheckedList([]);
  };
  const handleCreatePollModal = () => {
    setCreatePollModalIsOpened(!createPollModalIsOpened);
  };
  const handleRemovePollModal = () => {
    setRemovePollModalIsOpened(!removePollModalIsOpened);
  };
  const deletePolls = () => {
    setRemovePollModalIsOpened(false);
    socket.emit("deletePolls", { ids: checkedList });
  };
  const goEditPage = (e) => {
    navigate(`/manager/edit/${e.currentTarget.id}`);
  };
  const goSlidePage = (e) => {
    // console.log(e.currentTarget.id);
    // console.log(e.currentTarget.value);
    navigate(`/manager/app/${e.currentTarget.value}/${e.currentTarget.id}`);
  };

  useEffect(() => {
    socket.on("createProject", (data) => {
      navigate(`/manager/edit/${data._id}`);
    });

    socket.on("getProjectsByAdmin", (data) => {
      let newProjects = [];

      for (var i = 0; i < data.length; i++) {
        newProjects.push({
          id: data[i]._id,
          name: data[i].name,
          type: data[i].type,
          created: data[i].created.slice(0, 10),
        });
      }

      setRows([...newProjects]);
    });
    socket.on("deletePolls", (data) => {
      if (data.success) {
        setRowsModified(true);
      } else {
        alert("삭제에 실패했습니다.");
      }
    });

    socket.emit("getProjectsByAdmin", { admin: cookies.auth });

    return () => {
      socket.off("deletePolls");
      socket.off("createProject");
      socket.off("getProjectsByAdmin");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setRows(rows.filter((row) => !checkedList.includes(row.id)));
    setCheckedList([]);
    setRowsModified(false);
    // eslint-disable-next-line
  }, [rowsModified]);
  return (
    <Box sx={{ width: "80%", p: 4, boxSizing: "border-box" }}>
      <ListPaper sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Typography sx={{ fontSize: "32px" }}> 내 리스트 </Typography>
        </Box>

        <Box sx={{ display: "flex" }}>
          {checkedList.length !== 0 ? (
            <>
              <ManagerButton onClick={handleRemovePollModal}>
                <Typography color="error">삭제</Typography>
              </ManagerButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Typography> {checkedList.length}개 선택됨 </Typography>
                <Tooltip title="체크 해제" arrow>
                  <IconButton onClick={resetCheckBoxList}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <ManagerButton onClick={handleCreatePollModal}>
              <Typography color="primary">+ 생성하기</Typography>
            </ManagerButton>
          )}
        </Box>

        <Box sx={{ width: "100%", height: 400, flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            disableColumnMenu
            onSelectionModelChange={handleCheckList}
            selectionModel={checkedList}
            sx={neumorphism}
          />
        </Box>
      </ListPaper>
      <DeleteModal
        open={removePollModalIsOpened}
        handleModal={handleRemovePollModal}
        count={checkedList.length}
        deletePolls={deletePolls}
      />
      <CreateModal open={createPollModalIsOpened} handleModal={handleCreatePollModal} />
    </Box>
  );
};

const PollListPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e5edf2",
        height: "calc(var(--vh, 1vh) * 100)",
        boxSizing: "border-box",
      }}
    >
      <Header />
      <Box sx={{ height: "92%", display: "flex", boxSizing: "border-box" }}>
        <SideBar />
        <Content />
      </Box>
    </Box>
  );
};

export default PollListPage;
