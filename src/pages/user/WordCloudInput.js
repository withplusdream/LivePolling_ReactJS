import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, InputAdornment } from "@mui/material";
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
  let [cookies, setCookie] = useCookies();

  const [project, setProject] = useState({});

  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [inputCount, setInputCount] = useState(10);
  const [submitCount, setSubmitCount] = useState(0);
  const [update, setUpdate] = useState(false);
  const [count, setCount] = useState(0);

  const handleText = (e) => {
    if (e.target.value.length > inputCount) {
      setText(e.target.value.slice(0, inputCount));
    } else {
      setText(e.target.value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text === "") return;
    setIsSubmitted(false);
    if (submitCount * 1 === 0) {
      socket.emit("submitWord", { id: id, text: text });
      setButtonDisabled(true);
    } else {
      if (cookies[project.accessCode] * 1 >= submitCount) {
        setIsSubmitted(true);
        setButtonDisabled(true);
      } else {
        socket.emit("submitWord", { id: id, text: text });
        setButtonDisabled(true);
      }
    }
  };

  useEffect(() => {
    socket.on("getProjectById", (data) => {
      if (data.success) {
        setProject(data.project);
      } else {
        alert("잘못된 접근입니다.");
        navigate("/");
      }
    });
    socket.on("submitWord", (data) => {
      setSubmitComplete(true);
      window.sessionStorage.setItem(data.project.accessCode, count + 1);
      setCount(count + 1);
      let expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60 * 1);
      if (cookies[data.project.accessCode]) {
        let value = cookies[data.project.accessCode] * 1;
        setCookie(data.project.accessCode, value + 1, { path: "/", expires: expires });
      } else {
        setCookie(data.project.accessCode, 1, { path: "/", expires: expires });
      }
      setUpdate(!update);
      setTimeout(() => {
        setSubmitComplete(false);
        if (submitCount - cookies[data.project.accessCode] > 0 || submitCount * 1 === 0)
          setButtonDisabled(false);
      }, 2000);
    });
    socket.emit("getProjectById", { id: id });

    return () => {
      socket.off("getProjectById");
      socket.off("submitWord");
    };
    // eslint-disable-next-line
  }, [update]);

  useEffect(() => {
    setInputCount(project.data?.inputCount);
    setSubmitCount(project.data?.submitCount * 1);
    setCount(window.sessionStorage.getItem(project.accessCode) * 1);
  }, [project]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <img src={logo} style={{ width: "90%" }} alt="logo" />
      </Box>
      <Box>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <Box sx={{ ...neumorphism, display: "flex", justifyContent: "center" }}>
              <Box sx={{ my: 1 }}>
                <Typography sx={{ textAlign: "center", fontSize: "24px" }}>주제</Typography>
                <Typography sx={{ textAlign: "center", fontSize: "20px" }}>
                  {project.question}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box>
                <Grid container rowSpacing={2}>
                  <Grid item xs={12} sx={{ display: "flex" }}>
                    <NeumorphismTextField
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{inputCount - text.length}</InputAdornment>
                        ),
                      }}
                      placeholder={`단어를 입력해주세요(${inputCount}자 이내)`}
                      sx={{ mx: 1 }}
                      value={text}
                      onChange={handleText}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography>
                      제출 가능 횟수 :{" "}
                      {submitCount * 1 !== 0
                        ? submitCount - (cookies[id] ? cookies[id] * 1 : 0) >= 0
                          ? submitCount - (cookies[id] ? cookies[id] * 1 : 0)
                          : 0
                        : "무제한"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography>제출 횟수 :{count}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: isSubmitted ? "flex" : "none", justifyContent: "center" }}
                  >
                    <Typography color="error">이미 제출하셨습니다</Typography>
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
const WordCloudInput = () => {
  return (
    <Box sx={Background}>
      <Box>
        <Phone content={<Content />} />
        <CopyRight />
      </Box>
    </Box>
  );
};

export default WordCloudInput;
