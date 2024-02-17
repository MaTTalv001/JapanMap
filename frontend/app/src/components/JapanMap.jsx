import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import japanPrefectures from "../assets/japan.json";

const JapanMap = () => {
  const mapContainerRef = useRef(null);
  const [selectedUserNames, setSelectedUserNames] = useState([]);

  const users = [
  { id: 1, name:'Tanaka', prefecture: 'Hokkaido' },
  { id: 2, name:'Yamada', prefecture: 'Aomori' },
  { id: 3, name:'Ito', prefecture: 'Iwate' },
  { id: 4, name:'Suzuki', prefecture: 'Miyagi' },
  { id: 5, name:'Saito', prefecture: 'Akita' },
  { id: 6, name:'Sato', prefecture: 'Yamagata' },
  { id: 7, name:'Mastumoto', prefecture: 'Fukushima' },
  { id: 8, name:'Goto', prefecture: 'Ibaraki' },
  { id: 9, name:'Kondo', prefecture: 'Tochigi' },
    { id: 11, name: 'Maezono', prefecture: 'Tokyo' },
    { id: 12, name: 'Fukushima', prefecture: 'Kanagawa' },
    { id: 13, name: 'Ito', prefecture: 'Saitama' },
    { id: 14, name: 'Takeda', prefecture: 'Aichi' },
    { id: 15, name: 'Sawada', prefecture: 'Osaka' },
    { id: 16, name: 'Matsuno', prefecture: 'Osaka' },
    { id: 17, name: 'Erika', prefecture: 'Osaka' },
    { id: 18, name: 'Utan', prefecture: 'Osaka' },
    { id: 19, name: 'Ito-niki', prefecture: 'Tokyo' },
    { id: 20, name: 'bodo-niki', prefecture: 'Tokyo' },
];

  useEffect(() => {
    const width = 800; // 地図の幅
    const height = 600; // 地図の高さ

    const projection = d3.geoMercator()
                         .center([138, 38]) // 日本地図の中心点
                         .translate([width / 2, height / 2])
      .scale(1000);
    
    // 都道府県ごとのユーザー数を計算
  const userCountsByPrefecture = users.reduce((acc, user) => {
    acc[user.prefecture] = (acc[user.prefecture] || 0) + 1;
    return acc;
  }, {});

  // ユーザー数に基づいて色を決定する関数
  const getColor = (prefecture) => {
    const count = userCountsByPrefecture[prefecture] || 0;
    if (count === 0) return '#ddd'; // ユーザーがいない場合
    if (count < 1) return '#bbb';   // 少数の場合
    if (count < 3) return '#999';  // 中間の数の場合
    return '#777';                  // 多数の場合
  };


    const path = d3.geoPath().projection(projection);

    const svg = d3.select(mapContainerRef.current)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    svg.selectAll('path')
       .data(japanPrefectures.features)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('fill', d => getColor(d.properties.name)) // 色の濃淡を適用
      .attr('stroke', '#fff') // 都道府県の境界線の色
      .on('click', (event, d) => {
        console.log('Clicked prefecture:', d.properties.name);
        const clickedPrefecture = d.properties.name;
        const userNames = users.filter(user => user.prefecture === clickedPrefecture)
                             .map(user => user.name);
        setSelectedUserNames(userNames);
      });

    // ここで必要に応じてイベントハンドラを追加
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
    <div className="flex-1 flex justify-center">
      <div ref={mapContainerRef} />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold mb-1">Selected User:</h3>
      <ul>
        {selectedUserNames.map(id => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  </div>
  )
};

export default JapanMap;
