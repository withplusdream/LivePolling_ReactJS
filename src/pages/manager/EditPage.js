import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Select,
  FormControl,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudIcon from "@mui/icons-material/Cloud";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CloseIcon from "@mui/icons-material/Close";
import PieChartIcon from "@mui/icons-material/PieChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CircleIcon from "@mui/icons-material/Circle";

import Header from "./../../components/Header";
import SideBar from "./../../components/SideBar";
import { IconButton, ManagerButton } from "./../../components/Button";
import { NeumorphismTextField } from "./../../components/TextField";
import { EditPaper } from "./../../components/Paper";
import { neumorphism } from "../../styles/ui";
import { socket } from "./../../utils/socket";
import Toggle from "./../../components/Toggle";

const Content = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const id = useLocation().pathname.split("/")[3];

  const [project, setProject] = useState({});
  const [name, setName] = useState("");
  const [selectedValue, setSelectedValue] = useState("default");
  const [question, setQuestion] = useState("");

  // * WordCloud Variable
  const [overlap, setOverlap] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [inputCount, setInputCount] = useState(10);

  // * Choice Variable
  const [options, setOptions] = useState([
    { _id: new Date().getTime() + "", value: "" },
    { _id: new Date().getTime() + 1 + "", value: "" },
  ]);
  const [percentage, setPercentage] = useState(false);
  const [resultLayout, setResultLayout] = useState("bar");
  const [etcContained, setEtcContained] = useState(false);

  // * Error Handling
  const [questionError, setQuestionError] = useState(false);

  const goBack = () => {
    navigate("/manager");
  };
  const handleSelect = (e) => {
    setSelectedValue(e.target.value);
  };
  const handleQuestion = (e) => {
    setQuestionError(false);
    setQuestion(e.target.value);
  };
  const handleCheck = () => {
    setOverlap(!overlap);
  };
  const errorCheck = () => {
    if (question === "") {
      setQuestionError(true);
      return false;
    }
    if (selectedValue === "default") {
      alert("타입을 선택해주세요.");
      return false;
    }
    return true;
  };
  const validateChoice = () => {
    if (options.length <= 1) {
      alert("옵션을 두 가지 이상으로 추가해 입력해주세요");
      return false;
    }
    if (options.filter((option) => option.value === "").length > 0) {
      alert("질문 옵션에 대한 입력을 완료해주세요.");
      return false;
    }
    return true;
  };
  const modifyProject = () => {
    let data;

    if (!errorCheck()) return;

    switch (selectedValue) {
      case "wordcloud":
        data = { overlap: overlap, submitCount: submitCount, inputCount: inputCount };
        break;
      case "choice":
        if (!validateChoice()) return;

        data = {
          options: options,
          resultLayout: resultLayout,
          percentage: percentage,
          overlap: overlap,
          etcContained: etcContained,
        };
        break;
      default:
        break;
    }

    setProject({
      ...project,
      type: selectedValue,
      name: name,
      question: question,
      data: data,
    });

    socket.emit("modifyProject", {
      ...project,
      name: name,
      type: selectedValue,
      question: question,
      data: data,
    });
  };
  const handleName = (e) => {
    if (e.target.value.length > 25) {
      setName(e.target.value.slice(0, 25));
    } else {
      setName(e.target.value);
    }
  };
  const handleSubmitCount = (e) => {
    setSubmitCount(e.target.value);
  };
  const handleInputCount = (e) => {
    setInputCount(e.target.value);
  };
  const handlePercentage = () => {
    setPercentage(!percentage);
  };
  const handleEtcContained = () => {
    setEtcContained(!etcContained);
  };
  const handleResultLayout = (e) => {
    setResultLayout(e.currentTarget.id);
  };
  const handleOption = (e) => {
    let newOptions = [...options];

    newOptions.forEach((option) => {
      if (option._id === e.currentTarget.id) {
        option.value = e.target.value;
      }
    });

    setOptions(newOptions);
  };
  const addOption = () => {
    if (options.length === 10) return;

    setOptions([...options, { _id: new Date().getTime() + "", value: "" }]);
  };
  const deleteOption = (e) => {
    setOptions(options.filter((option) => option._id !== e.currentTarget.id));
  };

  useEffect(() => {
    socket.on("getProject", (data) => {
      if (!data) {
        alert("페이지에 대한 정보가 없습니다.");
        navigate("/manager");
      } else {
        setProject(data);
      }
    });

    socket.on("modifyProject", (data) => {
      if (data.success) {
        alert("수정이 완료되었습니다.");
      } else {
        alert("문제 수정에 오류가 생겨 리스트 페이지로 돌아갑니다.");
      }
      navigate("/manager");
    });

    socket.emit("getProject", { admin: cookies.auth, id: id });

    return () => {
      socket.off("getProject");
      socket.off("modifyProject");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setName(project.name);
    setQuestion(project.question);

    if (project.data) {
      setSelectedValue(project.type);
      setOverlap(project.data.overlap);

      if (project.type === "wordcloud") {
        setInputCount(project.data.inputCount);
        setSubmitCount(project.data.submitCount);
      } else if (project.type === "choice") {
        setPercentage(project.data.percentage);
        setEtcContained(project.data.etcContained);
        setResultLayout(project.data.resultLayout);
        setOptions(project.data.options);
      }
    }
  }, [project]);

  useEffect(() => {
    if (!overlap) {
      setSubmitCount(1);
    }
  }, [overlap]);

  return (
    <Box sx={{ width: "80%", pb: 3, pl: 1, pr: 3, pt: 1, boxSizing: "border-box" }}>
      <EditPaper sx={{ px: 4, py: 2 }}>
        <Box sx={{ width: "100%" }}>
          <Tooltip title="뒤로가기" arrow>
            <IconButton onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: "100%", mt: 1 }}>
            <NeumorphismTextField
              sx={{ fontSize: "40px", mb: 1, width: "50%" }}
              value={name || ""}
              placeholder="제목"
              onChange={handleName}
              InputProps={{
                endAdornment: <InputAdornment position="end">{25 - name?.length}</InputAdornment>,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box sx={neumorphism}>
            <Box
              sx={{
                width: "500px",
                p: 2,
                boxSizing: "border-box",
                display: "inline-flex",
                flexFlow: "row wrap",
                alignContent: "space-around",
              }}
            >
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ pt: 2 }}>
                    <Typography> 타입 </Typography>
                    <Type selectedValue={selectedValue} handleSelect={handleSelect} />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ width: "100%" }}>
                    <Typography>질문을 입력해주세요</Typography>
                    <NeumorphismTextField
                      fullWidth
                      size="small"
                      value={question ? question : ""}
                      onChange={handleQuestion}
                      error={questionError}
                      helperText={questionError ? "질문을 입력해주세요." : ""}
                    ></NeumorphismTextField>
                  </Box>
                </Grid>

                {selectedValue === "wordcloud" ? (
                  <WordCloudContent
                    overlap={overlap}
                    handleCheck={handleCheck}
                    inputCount={inputCount}
                    handleInputCount={handleInputCount}
                    submitCount={submitCount}
                    handleSubmitCount={handleSubmitCount}
                  />
                ) : (
                  <></>
                )}

                {selectedValue === "choice" ? (
                  <ChoiceContent
                    options={options}
                    handleOption={handleOption}
                    deleteOption={deleteOption}
                    addOption={addOption}
                    resultLayout={resultLayout}
                    handleResultLayout={handleResultLayout}
                    handlePercentage={handlePercentage}
                    percentage={percentage}
                    handleCheck={handleCheck}
                    overlap={overlap}
                    handleEtcContained={handleEtcContained}
                    etcContained={etcContained}
                  />
                ) : (
                  <></>
                )}
              </Grid>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <ManagerButton sx={{ color: "blue" }} onClick={modifyProject}>
            수정하기
          </ManagerButton>
        </Box>
      </EditPaper>
    </Box>
  );
};

const EditPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e5edf2",
        minHeight: "calc(var(--vh, 1vh) * 100)",
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

const Type = ({ selectedValue, handleSelect }) => {
  return (
    <FormControl fullWidth>
      <Select
        value={selectedValue}
        onChange={handleSelect}
        sx={{
          ...neumorphism,
          my: 1,
          border: "none",
          ".MuiOutlinedInput-notchedOutline": { border: 0 },
        }}
      >
        <MenuItem disabled value={"default"}>
          -- 타입을 선택해주세요 --
        </MenuItem>
        <MenuItem value={"wordcloud"}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText>Word Cloud</ListItemText>
          </Box>
        </MenuItem>
        <MenuItem value={"choice"}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ListItemIcon>
              <EqualizerIcon />
            </ListItemIcon>
            <ListItemText>Choice</ListItemText>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const WordCloudContent = (props) => {
  const { overlap, handleCheck, inputCount, handleInputCount, submitCount, handleSubmitCount } =
    props;
  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "50%", borderRight: 1, borderColor: "#00000015" }}>
            <Typography>중복 제출 가능 여부</Typography>
            <Checkbox size="large" checked={overlap} onChange={handleCheck} />
          </Box>
          <Box sx={{ mx: 1, width: "50%" }}>
            <Typography> 입력 글자 수 제한 (10 ~ 25자 내외)</Typography>
            <NeumorphismTextField
              size="small"
              sx={{ width: "75px" }}
              type="Number"
              value={inputCount}
              onKeyPress={(e) => {
                e.preventDefault();
              }}
              InputProps={{
                inputProps: { min: 10, max: 25 },
              }}
              onChange={handleInputCount}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: overlap ? "" : "none" }}>
        <Box sx={{ width: "100%" }}>
          <Typography>최대 제출 가능 수 ( '0' 으로 설정 시 제출 무제한 가능 )</Typography>
          <NeumorphismTextField
            size="small"
            sx={{ width: "75px" }}
            type="Number"
            value={submitCount}
            onKeyPress={(e) => {
              e.preventDefault();
            }}
            InputProps={{
              inputProps: { min: 0, max: 10 },
            }}
            onChange={handleSubmitCount}
          />
        </Box>
      </Grid>
    </>
  );
};

const ChoiceContent = (props) => {
  const {
    options,
    deleteOption,
    addOption,
    resultLayout,
    handleResultLayout,
    handlePercentage,
    percentage,
    handleCheck,
    overlap,
    handleEtcContained,
    etcContained,
    handleOption,
  } = props;
  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "18px", mb: 1 }}>질문 옵션</Typography>
        {options.map((option, index) => (
          <Box key={option._id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <NeumorphismTextField
              fullWidth
              sx={{ mr: "10px" }}
              value={option.value}
              onChange={handleOption}
              InputProps={{ id: option._id + "" }}
            />
            <IconButton onClick={deleteOption} id={option._id}>
              <CloseIcon />
            </IconButton>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <ManagerButton onClick={addOption}>+ 옵션 추가</ManagerButton>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography>Result Layout</Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              className={`result-layout ${resultLayout === "bar" ? "active" : ""}`}
              id="bar"
              onClick={handleResultLayout}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <EqualizerIcon />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Typography>막대 바</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              className={`result-layout ${resultLayout === "circle" ? "active" : ""}`}
              id="circle"
              onClick={handleResultLayout}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <PieChartIcon />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Typography>원형 그래프</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              className={`result-layout ${resultLayout === "donut" ? "active" : ""}`}
              id="donut"
              onClick={handleResultLayout}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <DonutLargeIcon />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Typography>도넛 그래프</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ mb: 1 }}>Extras</Typography>
        <Box sx={{ px: 2, display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircleIcon sx={{ fontSize: "10px", mr: "5px" }} />
            <Typography>투표 결과를 퍼센트로 보기</Typography>
          </Box>

          <Toggle onClick={handlePercentage} value={percentage} />
        </Box>

        <Box sx={{ px: 2, display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircleIcon sx={{ fontSize: "10px", mr: "5px" }} />
            <Typography>중복 투표 가능</Typography>
          </Box>

          <Toggle onClick={handleCheck} value={overlap} />
        </Box>

        <Box sx={{ px: 2, display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircleIcon sx={{ fontSize: "10px", mr: "5px" }} />
            <Typography>기타 옵션 추가</Typography>
          </Box>

          <Toggle onClick={handleEtcContained} value={etcContained} />
        </Box>
      </Grid>
    </>
  );
};
export default EditPage;
