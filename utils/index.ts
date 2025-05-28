import type { SidebarItems } from "@/@types";

import swiper1 from "../public/imgs/swiper1.jpg";
import swiper2 from "../public/imgs/swiper2.jpg";
import swiper3 from "../public/imgs/swiper3.jpg";
import swiper4 from "../public/imgs/swiper4.jpg";
import swiper5 from "../public/imgs/swiper5.jpg";
import swiper6 from "../public/imgs/swiper6.jpg";
import swiper7 from "../public/imgs/swiper7.jpg";
import swiper15 from "../public/imgs/swiper15.jpg";
import swiper9 from "../public/imgs/swiper9.jpg";
import swiper10 from "../public/imgs/swiper10.jpg";
import swiper11 from "../public/imgs/swiper11.jpg";
import swiper12 from "../public/imgs/swiper12.jpg";
import swiper13 from "../public/imgs/swiper13.jpg";
import swiper14 from "../public/imgs/swiper14.jpg"
 export const slide_imgs = [
  {
    id: 1,
    img: swiper1,
  },
  {
    id: 2,
    img: swiper2,
  },
  {
    id: 3,
    img: swiper3,
  },
  {
    id: 4,
    img: swiper4,
  },
  {
    id: 5,
    img: swiper5,
  },
  {
    id: 6,
    img: swiper6,
  },
  {
    id: 7,
    img: swiper7,
  },
  {
    id: 8,
    img: swiper15,
  },
  {
    id: 9,
    img: swiper9,
  },
  {
    id: 10,
    img: swiper10,
  },
  {
    id: 11,
    img: swiper11,
  },
  {
    id: 12,
    img: swiper12,
  },
  {
    id: 13,
    img: swiper13,
  },
  {
    id: 14,
    img: swiper14,
  },
];

// import dashboard from "../public/svgs/dashboard.svg"
import project from "../public/svgs/projects.svg"
 

export const admin_items: SidebarItems[] = [
 
  {
    id: 2,
    title: "Xodimlar",
    icon: project,
    path:"/xodimlar"
  },
    {
    id:3,
    title:"buyurtmalar",
    icon:project,
    path:"/order"
  },
 
 
];


export const xodim_items:SidebarItems[] =[

    {
    id:2,
    title:"buyurtmalar",
    icon:project,
    path:"/new_order"
  },
]