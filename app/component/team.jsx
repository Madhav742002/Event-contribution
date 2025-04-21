import React from "react";
import {
  TiContacts,
  TiSocialInstagram,
  TiSocialLinkedin,
  TiSocialLinkedinCircular,
} from "react-icons/ti";
import TrueFocus from "./TrueFocus";

export default function Team() {
  return (
    <div className="py-16 bg-gradient-to-r from-slate-700 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center w-full">
          <h1 className="text-xl md:text-5xl font-extrabold text-center text-white mb-8 md:mb-12 border-b-2 pb-4 border-white/30 inline-block">
          <TrueFocus
            sentence="Our Amazing Team"
            manualMode={false}
            blurAmount={3}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
          </h1>
          
        </div>
        <div className="flex justify-center items-center flex-wrap gap-5">
          <div className="flex flex-col justify-center items-center rounded-xl py-8 px-12 bg-white/10 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-2xl">
            <img
              src="madhav.jpg"
              alt="image"
              width={200}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold p-2 text-green-600">
              Madhav Kumar
            </h1>
            <h1 className="text-white">Fullstack Developer</h1>
            <h2 className="text-white">(BC/22/016)</h2>
            <div className="flex flex-row gap-3 m-3">
              <a
                href="https://www.linkedin.com/in/madhav-kumar-8010b9172/"
                target="_blank"
              >
                <TiSocialLinkedin className="text-2xl text-orange-600" />
              </a>
              <a href="not-found" target="_blank">
                <TiSocialInstagram className="text-2xl text-orange-600" />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl py-8 px-12 bg-white/10 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-2xl">
            <img
              src="pappu.jpg"
              alt="image"
              width={200}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold p-2 text-green-600">
              Pappu Kumar
            </h1>
            <h1 className="text-white">Fullstack Developer</h1>
            <h2 className="text-white">(BC/22/012)</h2>
            <div className="flex flex-row gap-3 m-3">
              <a
                href="https://www.linkedin.com/in/pappu-kumar-ba5103302/"
                target="_blank"
              >
                <TiSocialLinkedin className="text-2xl text-orange-600" />
              </a>
              <a
                href="https://www.instagram.com/zzara_india_wala/"
                target="_blank"
              >
                <TiSocialInstagram className="text-2xl text-orange-600" />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl py-8 px-12 bg-white/10 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-2xl">
            <img
              src="rajesh.jpg"
              alt="image"
              width={200}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold p-2 text-green-600">
              Rajesh Kumar
            </h1>
            <h1 className="text-white">Designer</h1>
            <h2 className="text-white">(BC/22/038)</h2>
            <div className="flex flex-row gap-3 m-3">
              <a href="not-found" target="_blank">
                <TiSocialLinkedin className="text-2xl text-orange-600" />
              </a>
              <a
                href="https://www.instagram.com/yadavboyrajeshroy/"
                target="_blank"
              >
                <TiSocialInstagram className="text-2xl text-orange-600" />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl py-8 px-12 bg-white/10 backdrop-blur-sm shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-2xl">
            <img
              src="yash.jpg"
              alt="image"
              width={200}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold p-2 text-green-600">Yash Roy</h1>
            <h1 className="text-white">Database</h1>
            <h2 className="text-white">(BC/22/085)</h2>
            <div className="flex flex-row gap-3 m-3">
              <a
                href="https://www.linkedin.com/in/yash-roy-88620229a/"
                target="_blank"
              >
                <TiSocialLinkedin className="text-2xl text-orange-600" />
              </a>
              <a
                href="https://www.instagram.com/yash_brahmbhattt/"
                target="blank"
              >
                <TiSocialInstagram className="text-2xl text-orange-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
