import {motion, spring} from "framer-motion";
import {ReactElement} from "react";

export default function Toggle({isOn, setIsOn, width = 45, height = 25, activeBackgroundColor = "#2979ff", tip}: {isOn: boolean, setIsOn: (isOn: boolean) => void, width?: number, height?: number, activeBackgroundColor?: string, tip?: ReactElement | string}) {

  return (
    <div className={"flex flex-row gap-2"}>
      <div
        className={" bg-gray-200 flex rounded-[50px] p-[3px] cursor-pointer transition-colors duration-200"}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          justifyContent: isOn ? "flex-end" : "flex-start",
          backgroundColor: isOn ? activeBackgroundColor : "#d3d3d3"
        }}
        data-ison={isOn} onClick={() => {
        setIsOn(!isOn)
      }}>
        <motion.div className={` rounded-[40px] bg-white`} layout transition={spring}
                    style={{height: `${height - 6}px`, width: `${height - 6}px`}}/>
      </div>
      <div id={"tip"}>{tip && tip}</div>
    </div>

  )
}