//Made with Love by Yash Chittora [github.com/yashchittora]

//isDarkMode = true: Text is white and background is black
//isDarkMode = false: Text is black and background is white
// ~~~ USER SETTINGS ~~~
const isDarkMode = true;
const showBackground = false;
const layoutPosition = "bottomLeft"; // Options: "topCenter", "topLeft", "topRight", "bottomCenter", "bottomLeft", "bottomRight"

// --- WIDGET CODE ---
// Linking of the Music Icon
const faScript = document.createElement("script");
faScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js";
document.head.appendChild(faScript);

// Importing necessary modules
import { run } from "uebersicht";
import { css } from "uebersicht";

// Margin variables for different positions
const margins = {
  topCenter: {
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "auto",
  },
  topLeft: {
    marginRight: "auto",
    marginLeft: "2vw",
    marginBottom: "auto",
  },
  topRight: {
    marginRight: "2vw",
    marginLeft: "auto",
    marginBottom: "auto",
  },
  bottomCenter: {
    marginTop: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "2vh",
  },
  bottomLeft: {
    marginTop: "auto",
    marginRight: "auto",
    marginLeft: "2vw",
    marginBottom: "2vh",
  },
  bottomRight: {
    marginTop: "auto",
    marginRight: "2vw",
    marginLeft: "auto",
  },
};

const selectedMargins = margins[layoutPosition];

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  animation: fadeIn 1s linear;
  pointer-events: none;
  user-select: none;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const darkModeStyles = isDarkMode
  ? css`
      background-color: black;
      color: white;
    `
  : css`
      background-color: white;
      color: black;
    `;

const backgroundStyles = showBackground
  ? css``
  : css`
      background-color: rgba(0, 0, 0, 0);
    `;

const text = css`
  margin-top: ${selectedMargins.marginTop};
  margin-right: ${selectedMargins.marginRight};
  margin-left: ${selectedMargins.marginLeft};
  margin-bottom: ${selectedMargins.marginBottom};
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 7px;
  font-size: 14px;
  color: white;
  font-family: futura;
  background-color: black;
  border-radius: 32px;
  user-select: none;
  cursor: default;
  ${darkModeStyles}
  ${backgroundStyles}
`;

// Function to check if Apple Music app is running
const isAppleMusicRunning = async () => {
  try {
    const result = await run(
      'osascript -e "tell application \"System Events\" to (name of processes) contains \"Music\""'
    );
    return result.trim() === "true";
  } catch (error) {
    console.error("Error checking if Apple Music is running:", error);
    return false;
  }
};

// Function to get the currently playing song for Apple Music
const getAppleMusicInfo = async () => {
  try {
    const isRunning = await isAppleMusicRunning();
    if (isRunning) {
      const result = await run(
        'osascript -e "tell application \"Music\" to if player state is playing then return artist of current track & \" - \" & name of current track"'
      );
      return result.trim();
    } else {
      return "No music playing";
    }
  } catch (error) {
    console.error("Error getting Apple Music info:", error);
    return "Apple Music: Not playing";
  }
};

// Exported variables and functions
export const command = async (dispatch) => {
  const appleMusicInfo = await getAppleMusicInfo();
  dispatch({ type: "SET_INFO", appleMusicInfo });
};

export const refreshFrequency = 1000;

export const initialState = { appleMusicInfo: "" };

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "SET_INFO":
      return { ...previousState, appleMusicInfo: event.appleMusicInfo };
    default:
      return previousState;
  }
};

// Structure of the widget
export const render = ({ appleMusicInfo }, dispatch) => {
  const displayInfo = appleMusicInfo || "No music playing";
  return (
    <div className={container}>
      <p className={text}>
        <i className="fas fa-music"></i> {displayInfo}
      </p>
    </div>
  );
};
