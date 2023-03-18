import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Radio } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Background, neumorphism } from "./../../styles/ui";
import { Phone } from "./../../components/Phone";
import { CopyRight } from "./../../components/CopyRight";
import logo from "../../assets/images/withplus Logo.png";
import { FormButton } from "./../../components/Button";
import { NeumorphismTextField } from "./../../components/TextField";
import { socket } from "./../../utils/socket";

const Content = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let [cookies, setCookie] = useCookies([id]);

  const [project, setProject] = useState({});

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [etcContained, setEtcContained] = useState(false);
  const [etcChecked, setEtcChecked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedOption.length === 0) {
      alert("선택 후 제출하기 버튼을 눌러주세요.");
      return;
    }

    if (etcChecked && text === "") {
      alert("기타의견을 입력해주세요");
      return;
    }

    setIsSubmitted(false);

    selectedOption.forEach((element) => {
      if (element === "etc") {
        socket.emit("submitEtc", { id: id, text: text });
      } else {
        let option = options.filter((option) => option._id === element);

        socket.emit("submitOption", { id: id, option: option[0].option });
      }
    });

    setButtonDisabled(true);
  };
  const handleSelectedOption = (e) => {
    if (project.data.overlap) {
      if (selectedOption.includes(e.currentTarget.id)) {
        setSelectedOption(selectedOption.filter((item) => item !== e.currentTarget.id));
      } else {
        setSelectedOption([...selectedOption, e.currentTarget.id]);
      }
    } else {
      if (selectedOption.includes(e.currentTarget.id)) {
        setSelectedOption([]);
      } else {
        setSelectedOption([e.currentTarget.id]);
      }
      setEtcChecked(false);
    }
  };

  const handleText = (e) => {
    setText(e.target.value);
  };

  const handleEtc = () => {
    if (project.data.overlap) {
      if (selectedOption.includes("etc")) {
        setSelectedOption(selectedOption.filter((item) => item !== "etc"));
        setEtcChecked(false);
      } else {
        setSelectedOption([...selectedOption, "etc"]);
        setEtcChecked(true);
      }
    } else {
      if (selectedOption.includes("etc")) {
        setSelectedOption([]);
        setEtcChecked(false);
      } else {
        setSelectedOption(["etc"]);
        setEtcChecked(true);
      }
    }
  };

  useEffect(() => {
    socket.on("getProjectById", (data) => {
      if (data.success) {
        setProject(data.project);
        // if (data.project.data.etcContained) {
        //   setOptions([
        //     ...data.project.data.options,
        //     { _id: new Date().getTime() + "", value: "기타" },
        //   ]);
        // } else setOptions(data.project.data.options);
      } else {
        alert("잘못된 접근입니다.");
        navigate("/");
      }
    });

    socket.on("getOptionsById", (data) => {
      setOptions(data.options);
    });
    socket.on("submitOption", (data) => {
      setSubmitComplete(true);
      let expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60);
      setCookie(data.project.accessCode, 1, { path: "/", expires: expires });
    });
    socket.on("submitEtc", (data) => {
      setSubmitComplete(true);
      let expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60);
      setCookie(data.project.accessCode, 1, { path: "/", expires: expires });
    });

    socket.emit("getProjectById", { id: id });
    socket.emit("getOptionsById", { id: id });

    return () => {
      socket.off("getProjectById");
      socket.off("getOptionsById");
      socket.off("submitOption");
      socket.off("submitEtc");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // console.log(project);
    if (project.data?.etcContained) {
      setEtcContained(true);
    }
  }, [project]);

  useEffect(() => {
    if (cookies[project.accessCode]) {
      setButtonDisabled(true);
      setIsSubmitted(true);
    }
  }, [buttonDisabled, cookies, project]);
  // useEffect(() => {
  //   console.log(selectedOption);
  // }, [selectedOption]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={logo} style={{ width: "90%" }} alt="logo" />
      </Box>
      <Box>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <Box sx={{ ...neumorphism, display: "flex", justifyContent: "center" }}>
              <Box sx={{ my: 1, width: "100%" }}>
                <Typography sx={{ textAlign: "center", fontSize: "24px" }}>주제</Typography>
                <Box
                  sx={{
                    width: "90%",
                    mx: "auto",
                    my: 1,
                    p: 1,
                    background: "#ecf3f9",
                    boxShadow: "inset 5px 5px 5px #cdd3d7, inset -5px -5px 5px #ffffff",
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={{ textAlign: "center", fontSize: "20px", width: "100%" }}>
                    {project.question}
                  </Typography>
                  {project.data?.overlap ? (
                    <Typography
                      sx={{ textAlign: "center", fontSize: "14px", width: "100%", color: "blue" }}
                      children={"중복 투표 가능"}
                    />
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {options.map((option) => (
              <Box
                key={option._id}
                sx={{
                  ...neumorphism,
                  my: 2,
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mx: 3,
                  cursor: "pointer",
                  "&:hover": {
                    background: selectedOption.includes(option._id) ? "" : "#e1e8ed",
                  },
                  background: selectedOption.includes(option._id) ? "#ecf3f9" : "f1f8fd",
                  boxShadow: selectedOption.includes(option._id)
                    ? "inset 5px 5px 5px #cdd3d7, inset -5px -5px 5px #ffffff"
                    : "2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 2px rgba(255, 255, 255, 0.5), inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05)",
                }}
                onClick={handleSelectedOption}
                id={option._id}
              >
                <Radio
                  sx={{
                    width: "10%",
                    "&.Mui-checked": {
                      color: "#ababab",
                    },
                  }}
                  checked={selectedOption.includes(option._id)}
                />
                <Typography>{option.option}</Typography>
              </Box>
            ))}
            {etcContained ? (
              <Box
                sx={{
                  ...neumorphism,
                  my: 2,
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mx: 3,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: etcChecked ? "" : "#e1e8ed",
                  },
                  background: etcChecked ? "#ecf3f9" : "f1f8fd",
                  boxShadow: etcChecked
                    ? "inset 5px 5px 5px #cdd3d7, inset -5px -5px 5px #ffffff"
                    : "2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 2px rgba(255, 255, 255, 0.5), inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05)",
                }}
                onClick={handleEtc}
              >
                <Radio
                  sx={{
                    width: "10%",
                    "&.Mui-checked": {
                      color: "#ababab",
                    },
                  }}
                  checked={etcChecked}
                />
                <Typography>기타</Typography>
              </Box>
            ) : (
              <></>
            )}
            <Box
              sx={{
                mx: 5,
                maxHeight: etcChecked ? "50px" : "0px",
                overflow: "hidden",
                transition: ".5s ease",
              }}
            >
              <NeumorphismTextField
                fullWidth
                size="small"
                placeholder="기타의견을 입력해주세요"
                autoComplete="off"
                value={text}
                onChange={handleText}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: submitComplete ? "flex" : "none",
              justifyContent: "center",
              transition: "1s",
            }}
          >
            <Typography color="primary">제출이 완료되었습니다.</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: isSubmitted ? "flex" : "none", justifyContent: "center" }}
          >
            <Typography color="error">이미 제출하셨습니다</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box>
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <FormButton onClick={handleSubmit} disabled={buttonDisabled}>
                      제출하기
                    </FormButton>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
const ChoiceInput = () => {
  return (
    <Box sx={Background}>
      <Box>
        <Phone content={<Content />} />
        <CopyRight />
      </Box>
    </Box>
  );
};

export default ChoiceInput;
