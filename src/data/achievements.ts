export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {id:'visit_all',name:'太阳系旅行者',desc:'访问所有9个天体',icon:'rocket'},
  {id:'visit_sun',name:'逐日者',desc:'访问太阳',icon:'sun'},
  {id:'visit_earth',name:'回家看看',desc:'访问地球',icon:'globe'},
  {id:'visit_saturn',name:'指环王',desc:'访问土星',icon:'ring'},
  {id:'visit_uranus',name:'躺平大师',desc:'访问天王星',icon:'spiral'},
  {id:'quiz_3',name:'初级天文学家',desc:'答对3道题',icon:'book'},
  {id:'quiz_10',name:'天文学博士',desc:'答对10道题',icon:'cap'},
  {id:'compare',name:'比较研究员',desc:'使用大小对比',icon:'scale'},
  {id:'lab',name:'物理学家',desc:'使用实验室',icon:'microscope'},
  {id:'speed10',name:'时间领主',desc:'加速到10天/秒以上',icon:'timer'},
  {id:'all_moons',name:'卫星猎人',desc:'访问所有有卫星的行星',icon:'moon'},
  {id:'far_away',name:'深空探索者',desc:'访问海王星',icon:'star'},
];
