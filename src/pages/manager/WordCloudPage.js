import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import ReactWordcloud from "react-wordcloud";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import Header from "./../../components/Header";
import qrcode from "../../assets/images/qrcode.png";
import localQrcode from "../../assets/images/qrcode(local).png";
import { IconButton } from "./../../components/Button";
import { SlidePaper } from "../../components/Paper";
import { neumorphism } from "../../styles/ui";
import { socket } from "./../../utils/socket";

const Content = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  // const id = useLocation().pathname.split("/")[4];
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [words, setWords] = useState([]);
  const [word, setWord] = useState("");
  const [count, setCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  // {text:"1", value:1}
  // const size = [900, 500];
  const tabs = ["Word Cloud", "Graph"];

  const goBack = () => {
    navigate(`/manager`);
  };
  const resetSlide = () => {
    if (window.confirm("리셋하시겠습니까?")) {
      socket.emit("resetSlide", { id: id });
    }
  };
  const nextTab = () => {
    setTabIndex(tabIndex + 1);
  };
  const prevTab = () => {
    setTabIndex(tabIndex - 1);
  };

  useEffect(() => {
    socket.on("getProject", (data) => {
      setProject(data);
    });
    socket.on("sendWord", (data) => {
      setWord(data.text);
    });
    socket.on("getWords", (data) => {
      data.words.sort(function (a, b) {
        // if (a.hasOwnProperty("value")) {
        return b.value - a.value;
        // }
      });
      setWords(data.words);
    });
    socket.on("resetSlide", (data) => {
      if (data.success) {
        alert("리셋이 완료되었습니다.");
        window.location.reload();
      } else {
        alert("리셋에 오류가 생겨 페이지가 새로고침 됩니다.");
        window.location.reload();
      }
    });
    socket.emit("getProject", { admin: cookies.auth, id: id });
    socket.emit("joinRoom", { id: id });
    socket.emit("getWords", { id: id });

    return () => {
      socket.off("getProject");
      socket.off("sendWord");
      socket.off("getWords");
      socket.off("resetSlide");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let index = words.findIndex((item, index) => {
      return item.text === word;
    });
    if (word === "") return;
    // console.log(words);
    let newArray = words;

    if (index !== -1) {
      let newArray = words;
      newArray[index].value += 1;
      // setWords(newArray);
    } else {
      newArray.push({ text: word, value: 1 });
      // setWords([...words, { text: word, value: 1 }]);
    }
    newArray.sort(function (a, b) {
      // if (a.hasOwnProperty("value")) {
      return b.value - a.value;
      // }
    });
    setWords(newArray);
    setWord("");
    setCount(count + 1);
    // eslint-disable-next-line
  }, [word]);

  useEffect(() => {
    setCount(project.count);
  }, [project]);

  return (
    <Box sx={{ width: "100%", p: 4, boxSizing: "border-box" }}>
      <SlidePaper sx={{ px: 4, py: 3 }}>
        <Box sx={{ width: "20%" }}>
          <Tooltip title="뒤로가기" arrow>
            <IconButton onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography sx={{ textAlign: "center", fontSize: "32px" }}>접속 방법</Typography>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ ...neumorphism, mb: 1, py: 1 }}>
              <img
                src={process.env.NODE_ENV === "development" ? localQrcode : qrcode}
                style={{ width: "75%", margin: "20px 10px" }}
                alt="qrcode"
              />
            </Box>
          </Box>
          <Box sx={{ ...neumorphism, py: 1 }}>
            <Typography sx={{ fontSize: "20px", textAlign: "center" }}>1. 접속 URL </Typography>
            <Typography sx={{ fontSize: "20px", textAlign: "center" }}>
              https://polls.wplusedu.co.kr
            </Typography>
            <Typography sx={{ fontSize: "20px", mt: 3, textAlign: "center" }}>
              2. 접속 코드
            </Typography>
            <Typography sx={{ fontSize: "32px", color: "red", textAlign: "center" }}>
              {project.accessCode ? (project.accessCode + "").slice(0, 3) : "123"}
              &nbsp;
              {project.accessCode ? (project.accessCode + "").slice(3, 6) : "456"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "80%" }}>
          <Box
            sx={{
              ...neumorphism,
              position: "relative",
              width: "100%",
              height: "100%",
              mx: 1,
              p: 1,
              boxSizing: "border-box",
            }}
          >
            {tabIndex === 0 ? (
              <WorldCloud words={words} question={project.question} />
            ) : (
              <Graph words={words} question={project.question} count={count} />
            )}

            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography>투표수 : {count}</Typography>
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: 10,
                bottom: 10,
                transform: "translate(0%, 0%)",
              }}
            >
              <Tooltip title="리셋" arrow>
                <IconButton onClick={resetSlide}>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: 0,
                bottom: "50%",
                ml: 1,
                display: tabIndex === 0 ? "none" : "",
              }}
            >
              <Tooltip arrow title="Word Cloud">
                <IconButton onClick={prevTab}>
                  <NavigateBeforeIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: "50%",
                mr: 1,
                display: tabIndex === 1 ? "none" : "",
              }}
            >
              <Tooltip arrow title="그래프" sx={{ fontSize: "20px" }}>
                <IconButton onClick={nextTab}>
                  <NavigateNextIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: "50%", mb: 1, display: "flex" }}>
              {tabs.map((tab, index) => (
                <span
                  key={index}
                  style={{
                    display: "flex",
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    backgroundColor: index === tabIndex ? "#1878BE" : "#ababab",
                    content: "",
                    marginRight: "3px",
                    transition: "0.5s",
                    boxShadow:
                      "2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 2px rgba(255, 255, 255, 0.5), inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05)",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </SlidePaper>
    </Box>
  );
};

const WordCloudPage = () => {
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
        <Content />
      </Box>
    </Box>
  );
};

const WorldCloud = ({ words, question }) => {
  return (
    <Box sx={{ height: "100%" }}>
      <Typography sx={{ fontSize: "28px" }}>주제 - {question}</Typography>
      <ReactWordcloud
        words={words}
        // size={size}
        options={{
          fontSizes: [20, 90],
          fontFamily: "BMJUA",
          rotations: 0,
          // spiral: "archimedean",
          deterministic: true,
          enableOptimizations: false,
          // cdd,sss
        }}
      />
    </Box>
  );
};

const Graph = ({ words, question, count }) => {
  return (
    <Box
      sx={{
        width: "98%",
        height: "90%",
        position: "absolute",
        overflowY: "auto",
        boxSizing: "border-box",
        margin: "auto",
      }}
    >
      <Typography sx={{ fontSize: "28px" }}>주제 - {question}</Typography>

      {words?.map((word) => (
        <Box key={word.text} sx={{ display: "flex", justifyContent: "space-between", px: "10%" }}>
          <Box sx={{ width: "40%", display: "flex" }}>
            <Typography sx={{ width: "50%" }}>{word.text}</Typography>
            <Typography>({word.value})</Typography>
          </Box>

          <Box
            sx={{
              width: "60%",
              display: "flex",
              justifyContent: "flex-end",
              height: "16px",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                backgroundColor: "#efefef",
                position: "relative",
                height: "16px",
                mr: "10px",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "#B43F3FEE",
                  width: `${(word.value / count) * 100}%`,
                  height: "16px",
                  transition: ".3s",
                }}
              />
            </Box>

            <Typography sx={{ width: "10%" }}>
              {((word.value / count) * 100).toPrecision(3)}%
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WordCloudPage;
