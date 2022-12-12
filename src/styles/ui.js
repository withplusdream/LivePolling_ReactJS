
export const Background = {
    backgroundColor: "#e5edf2",
    height: "calc(var(--vh, 1vh) * 100)",
    display: "flex",
    justifyContent: "center",
}

export const PhoneStyle = {
    backgroundColor: "#f1f8fd",
    boxSizing: "border-box",
    position:"relative",
    boxShadow: "20px 20px 30px 0 rgba(0, 0, 0, 0.1)",
    height: {xs:"calc(var(--vh, 1vh) * 92)", sm:"89vw", lg:"calc(var(--vh, 1vh) * 92)"},
    width: {xs:"95vw",sm:"50vw", lg:"33vw"},
    borderRadius: "40px",
    my:{xs:"2vh", lg:"2vh"},
    px:1, 
    py:3
}

export const PhoneBar = {
    position:"absolute",
    bottom:9,
    left:"33%",
    backgroundColor: "#c8d4dd",
    height: "6px",
    borderRadius: "3px",
    display: "block",
    width: "33%",
}

export const neumorphism = {
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 2px rgba(255, 255, 255, 0.5), inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05)",
    border: "none",
    borderRadius: "15px",
    background:"#f1f8fd"
}


