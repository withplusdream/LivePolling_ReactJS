import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Box, Tooltip, Typography, Grid } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import Header from "./../../components/Header";
import qrcode from "../../assets/images/qrcode.png";
import localQrcode from "../../assets/images/qrcode(local).png";
import { IconButton } from "./../../components/Button";
import { SlidePaper } from "../../components/Paper";
import { neumorphism } from "../../styles/ui";
import { socket } from "./../../utils/socket";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ToolTip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ToolTip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const backgroundColor = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",

  "rgba(75, 159, 206, 0.7)",
  "rgba(255, 162, 64, 0.7)",
  "rgba(75, 159, 64, 0.7)",
  "rgba(255, 162, 132, 0.7)",
];

const ChoicePage = (props) => {
  const { id } = useParams();
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [project, setProject] = useState({});

  const [labels, setLabels] = useState([]);
  const [count, setCount] = useState(0);
  const [values, setValues] = useState([]);
  const [max, setMax] = useState(100);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState(["graph"]);
  const [etcOptions, setEtcOptions] = useState([]);

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        // backgroundColor: "#c2cbd9",
        backgroundColor: backgroundColor,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return project.data.percentage
              ? " 비율 : " + context.raw.toPrecision(3) + " %"
              : " 투표 수 : " + context.raw;
          },
        },
      },
      datalabels: {
        display: true,
        color: "black",
        font: { size: "18px", weight: "bold", family: "BMJUA" },
        align: "end",
        anchor: "end",
        formatter: (value, ctx) => {
          const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value * 100) / sum).toFixed(2) + "%";
          return project.data.percentage ? percentage : value;
        },
      },
    },
    scales: {
      y: { min: 0, max: max > 5 ? max + 10 : 6 },
    },
  };

  const circleOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return project.data.percentage
              ? " 비율 : " + context.raw.toPrecision(3) + " %"
              : " 투표 수 : " + context.raw;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        formatter: (value, ctx) => {
          const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value * 100) / sum).toFixed(2) + "%";
          return value ? (project.data.percentage ? percentage : value + " 표") : null;
        },
        font: {
          size: "20px",
          weight: "bold",
          family: "NotoSansKR-Medium",
          align: "center",
        },
        // align: "center",
        // anchor: "center",
      },
    },
  };

  const goBack = () => {
    navigate("/manager");
  };
  const resetSlide = () => {
    console.log("hello");
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

  const val = {
    project: project,
    data: data,
    options: options,
    count: count,
    circleOptions: circleOptions,
    tabIndex: tabIndex,
    tabs: tabs,
    etcOptions: etcOptions,
  };
  const func = {
    goBack: goBack,
    resetSlide: resetSlide,
    prevTab: prevTab,
    nextTab: nextTab,
  };

  useEffect(() => {
    socket.on("connect", (data) => {
      socket.emit("joinRoom", { id: id });
    });
    socket.on("getProject", (data) => {
      setProject(data);

      if (data.data.etcContained) {
        setTabs(["graph", "etc"]);
      }
      // setCount
      // console.log(data);
    });
    socket.on("getOptionsById", (data) => {
      // console.log(data);
      let options = [];
      let values = [];
      // data.options.reverse();
      for (var i = 0; i < data.options.length; i++) {
        options.push(data.options[i].option);
        values.push(data.options[i].value);
      }
      if (data.project.data.etcContained) {
        options.push("기타");
        values.push(data.etcOption.value);
        setEtcOptions(data.etcOption.texts);
      }
      // console.log(data.project);
      // console.log(values);
      let sum = values.reduce((a, b) => a + b, 0);
      setCount(sum);

      if (data.project.data.percentage) {
        for (i = 0; i < values.length; i++) {
          values[i] = (values[i] / sum) * 100;
        }
      }

      setLabels(options);
      setValues(values);
    });
    socket.on("resetSlide", (data) => {
      if (data.success) {
        alert("리셋이 완료되었습니다.");
        window.location.reload();
      }
    });
    socket.emit("getProject", { admin: cookies.auth, id: id });
    socket.emit("getOptionsById", { id: id });
    socket.emit("joinRoom", { id: id });

    return () => {
      socket.off("getProject");
      socket.off("getOptionsById");
      socket.off("resetSlide");
    };
    // eslint-disable-next-line
  }, [cookies.auth, id]);

  useEffect(() => {
    // setCount(values.reduce((a, b) => a + b, 0));
    setMax(Math.max.apply(null, values));
  }, [values]);

  // useEffect(() => {
  //   console.log(count);
  // }, [count]);

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
        <Content val={val} func={func} />
      </Box>
    </Box>
  );
};

const Content = ({ val, func }) => {
  return (
    <Box sx={{ width: "100%", p: 4, boxSizing: "border-box" }}>
      <SlidePaper sx={{ px: 4, py: 3 }}>
        <Box sx={{ width: "20%", py: 2, px: 1, boxSizing: "border-box" }}>
          <Tooltip title="뒤로가기" arrow>
            <IconButton onClick={func.goBack}>
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
              {val.project.accessCode ? (val.project.accessCode + "").slice(0, 3) : "123"}
              &nbsp;
              {val.project.accessCode ? (val.project.accessCode + "").slice(3, 6) : "456"}
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
            <Box
              sx={{ height: "100%", position: "relative", overflowX: "auto", overflowY: "hidden" }}
            >
              <Typography sx={{ fontSize: "28px" }}>주제 - {val.project.question}</Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "45px",
                  left: "45px",
                  top: "45px",
                  right: "45px",
                  backgroundColor: "#ecf3f9",
                  borderRadius: "10px",
                  boxShadow: "inset 5px 5px 5px #cdd3d7, inset -3px -3px 5px #ffffff",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "90%",
                    height: "90%",
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {val.tabIndex === 0 ? (
                    val.project.data?.resultLayout === "bar" ? (
                      <Bar options={val.options} data={val.data} />
                    ) : val.project.data?.resultLayout === "circle" ? (
                      <Pie data={val.data} options={val.circleOptions} />
                    ) : (
                      <Doughnut data={val.data} options={val.circleOptions} />
                    )
                  ) : (
                    <></>
                  )}
                  {/* {val.project.data?.resultLayout === "bar" ? (
                    <Bar options={val.options} data={val.data} />
                  ) : (
                    <></>
                  )}
                  {val.project.data?.resultLayout === "circle" ? (
                    <Pie data={val.data} options={val.circleOptions} />
                  ) : (
                    <></>
                  )}
                  {val.project.data?.resultLayout === "donut" ? (
                    <Doughnut data={val.data} options={val.circleOptions} />
                  ) : (
                    <></>
                  )} */}
                  <Box
                    sx={{
                      position: "absolute",
                      height: "100%",
                      width: "50%",
                      border: "1px solid #00000028",
                      borderRadius: "10px",
                      p: 2,
                      boxSizing: "border-box",
                      display: val.tabIndex === 1 ? "" : "none",
                      overflowY: "auto",
                    }}
                  >
                    <Typography sx={{ fontSize: "24px", mb: 1 }}>기타 의견</Typography>
                    <Grid container spacing={1}>
                      {val.tabIndex === 1 &&
                        val.etcOptions.map((val, index) => (
                          <Grid item xs={12} key={index}>
                            <Typography>- {val}</Typography>
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography>투표수 : {val.count}</Typography>
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
                <IconButton onClick={func.resetSlide}>
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
                display: val.tabIndex === 0 ? "none" : "",
              }}
            >
              <Tooltip arrow title="Word Cloud">
                <IconButton onClick={func.prevTab}>
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
                display: val.tabIndex === val.tabs.length - 1 ? "none" : "",
              }}
            >
              <Tooltip arrow title="그래프" sx={{ fontSize: "20px" }}>
                <IconButton onClick={func.nextTab}>
                  <NavigateNextIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: "50%", mb: 1, display: "flex" }}>
              {val.tabs.map((tab, index) => (
                <span
                  key={index}
                  style={{
                    display: "flex",
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    backgroundColor: index === val.tabIndex ? "#1878BE" : "#ababab",
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

export default ChoicePage;
