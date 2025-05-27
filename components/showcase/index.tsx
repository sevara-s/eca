"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { Button } from "@mui/material";
import "swiper/css";
import "swiper/css/effect-fade";
import { slide_imgs } from "@/utils";



export default function Showcase() {
  return (
    <section className="showcase py-8  mt-[30px]">
      <div className="container mx-auto px-4 mt-[50px]">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={1000}
          centeredSlides={true}
          className="mySwiper"
        >
          {slide_imgs.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full max-w-3xl h-[400px] md:h-[500px]">
                <Image
                  src={slide.img}
                  alt={`Slide ${slide.id}`}
                  fill
                  className="object-contain w-full"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={slide.id === 1}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="btns flex items-center flex-wrap justify-center mt-[40px] gap-[20px]">
          <Button className="!bg-[#19a3dd] !text-white">
            Texnik yordam
          </Button>
          <Button className="!bg-[#19a3dd] !text-white">
            Yangi montajni amalga oshirish
          </Button>
          <Button className="!bg-[#19a3dd] !text-white">Katalog yuklash</Button>
        </div>
      </div>

      <style jsx global>{`
        .mySwiper {
          width: 100%;
        }
      `}</style>
    </section>
  );
}
