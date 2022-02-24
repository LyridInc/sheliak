// import React from "react";
// import {Scatter, ScatterChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
// import PropTypes from "prop-types";
// import CustomTooltip from "./Tooltip";
//
// const ScatterChartCustom = (props) => {
//     const {
//         data,
//         width,
//         height,
//         unit,
//         yAxisDomain,
//         handleXAxisTickFormat,
//         handleTooltipValue,
//         handleTooltipLabel,
//     } = props;
//
//     return (
//         <ScatterChart
//             data={data[0].data}
//             width={width}
//             height={height}
//             margin={{right: 10}}
//         >
//             <XAxis
//                 dataKey="time"
//                 domain = {['auto', 'auto']}
//                 scale="time"
//                 type="number"
//                 minTickGap={10}
//                 tickMargin={5}
//                 tickFormatter={handleXAxisTickFormat} />
//
//             <YAxis
//                 dataKey='value'
//                 domain={yAxisDomain}
//                 unit={unit} />
//             <CartesianGrid strokeDasharray="0" stroke="#DCDEDE"/>
//             <Scatter type='monotone' fill='#673ab7' isAnimationActive={false} className="" />
//             <Tooltip content={
//                 <CustomTooltip labelFormatter={handleTooltipLabel} tooltipValue={handleTooltipValue} />
//             } />
//         </ScatterChart>
//     )
// }
//
// ScatterChartCustom.propTypes = {
//     data: PropTypes.array,
//     width: PropTypes.number,
//     height: PropTypes.number,
//     unit: PropTypes.string,
//     yAxisDomain: PropTypes.array,
//     handleXAxisTickFormat: PropTypes.func,
//     handleYAxisTickFormat: PropTypes.func,
//     handleTooltipValue: PropTypes.func,
//     handleTooltipLabel: PropTypes.func,
// }
//
// export default ScatterChartCustom;
