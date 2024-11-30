import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const margin = 50;

const FightScene = {
  width: screenWidth,
  height: screenHeight,
  margin: margin,
};

export default FightScene;
